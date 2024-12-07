interface Window {
    ethereum?: {
        isMetaMask?: boolean; // Kiểm tra nếu MetaMask được sử dụng
        request: (args: { method: string; params?: Array<any> }) => Promise<any>;
        on?: (event: string, callback: (...args: any[]) => void) => void; // Lắng nghe sự kiện từ MetaMask
    };
}