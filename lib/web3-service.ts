import { ethers } from 'ethers';
import { InvoiceToken__factory, InvoiceMarketplace__factory } from '../typechain-types';

export class Web3Service {
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;
  private invoiceToken: ReturnType<typeof InvoiceToken__factory.connect>;
  private marketplace: ReturnType<typeof InvoiceMarketplace__factory.connect>;

  constructor(
    private invoiceTokenAddress: string,
    private marketplaceAddress: string
  ) {}

  async connect() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Please install MetaMask!');
    }

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    await this.provider.send('eth_requestAccounts', []);
    this.signer = this.provider.getSigner();

    this.invoiceToken = InvoiceToken__factory.connect(
      this.invoiceTokenAddress,
      this.signer
    );

    this.marketplace = InvoiceMarketplace__factory.connect(
      this.marketplaceAddress,
      this.signer
    );
  }

  async createInvoice(
    buyer: string,
    amount: string,
    invoiceURI: string,
    dueDate: number
  ) {
    if (!this.invoiceToken) throw new Error('Not connected');
    const tx = await this.invoiceToken.createInvoice(
      buyer,
      ethers.utils.parseEther(amount),
      invoiceURI,
      dueDate
    );
    return tx.wait();
  }

  async listInvoice(tokenId: string, price: string) {
    if (!this.marketplace) throw new Error('Not connected');
    const tx = await this.marketplace.listInvoice(
      tokenId,
      ethers.utils.parseEther(price)
    );
    return tx.wait();
  }

  async buyInvoice(tokenId: string, price: string) {
    if (!this.marketplace) throw new Error('Not connected');
    const tx = await this.marketplace.buyInvoice(tokenId, {
      value: ethers.utils.parseEther(price),
    });
    return tx.wait();
  }

  async cancelListing(tokenId: string) {
    if (!this.marketplace) throw new Error('Not connected');
    const tx = await this.marketplace.cancelListing(tokenId);
    return tx.wait();
  }

  async getInvoice(tokenId: string) {
    if (!this.invoiceToken) throw new Error('Not connected');
    return this.invoiceToken.getInvoice(tokenId);
  }

  async getListing(tokenId: string) {
    if (!this.marketplace) throw new Error('Not connected');
    return this.marketplace.getListing(tokenId);
  }

  async payInvoice(tokenId: string, amount: string) {
    if (!this.invoiceToken) throw new Error('Not connected');
    const tx = await this.invoiceToken.payInvoice(tokenId, {
      value: ethers.utils.parseEther(amount),
    });
    return tx.wait();
  }
}