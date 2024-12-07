
import { ethers } from 'ethers';
const {ccclass, property} = cc._decorator;

const velodromeRouterAddress = "0x4bF3E32de155359D1D75e8B474b66848221142fc"; // Địa chỉ hợp đồng của Velodrome Router
const velodromeRouterAbi = [
    "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts)"
];

@ccclass
export default class MetaMaskLogin extends cc.Component {

    @property(cc.Label)
    public addressLabel: cc.Label | null = null;
    @property(cc.EditBox)
    inputBox: cc.EditBox = null;

    @property(cc.Button)
    public loginButton: cc.Button | null = null;
    private provider: ethers.providers.Web3Provider | null = null;
    private router:any;
    protected onLoad(): void {
        if (this.loginButton) {
            this.loginButton.node.on('click', this.connectMetaMask, this);
        }
    }
    async connectMetaMask() {
        try {
            // Kiểm tra nếu MetaMask đã cài đặt
            if ( typeof window !== 'undefined' && window.ethereum) {

                  // Yêu cầu người dùng kết nối ví
                this.provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await this.provider.send('eth_requestAccounts', []);
                this.router = new ethers.Contract(velodromeRouterAddress, velodromeRouterAbi, this.provider.getSigner());
                // Hiển thị địa chỉ ví đầu tiên
                 if (this.addressLabel) {
                     this.addressLabel.string = `Địa chỉ: ${accounts[0]}`;
                }
                console.log('Kết nối thành công!', accounts[0]);              
            }
            else
            {
                console.error('MetaMask chưa được cài đặt!');
             
            }
           
          
        } catch (error) {
            console.error('Kết nối MetaMask thất bại!', error);
        }
    }

    async  swapTokens(amountIn, tokenA, tokenB) {
        // 1. Kiểm tra số dư tokenA
        const tokenAContract = new ethers.Contract(tokenA, tokenAbi, signer);
        const balance = await tokenAContract.balanceOf(await signer.getAddress());
        if (balance.lt(ethers.parseUnits(amountIn, 18))) {
            alert('Không đủ số dư Token A!');
            return;
        }
    
        // 2. Approve tokenA cho Router
        const approveTx = await tokenAContract.approve(velodromeRouterAddress, ethers.parseUnits(amountIn, 18));
        await approveTx.wait();
        console.log("Token A đã được approve!");
    
        // 3. Thực hiện giao dịch swap
        const path = [tokenA, tokenB];  // Đường swap từ Token A sang Token B
        const amountOutMin = 0;  // Có thể tính toán `amountOutMin` dựa trên slippage
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10;  // Đặt thời gian hết hạn giao dịch (10 phút)
    
        const swapTx = await router.swapExactTokensForTokens(
            ethers.parseUnits(amountIn, 18),  // Số lượng Token A cần swap
            amountOutMin,  // Số lượng tối thiểu Token B muốn nhận
            path,          // Đường đi từ Token A đến Token B
            await signer.getAddress(),  // Địa chỉ nhận Token B
            deadline
        );
    
        console.log('Đang thực hiện giao dịch swap...');
        await swapTx.wait();
        console.log('Swap thành công!');
    }


}


