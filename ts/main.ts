async function sha256Hex(input: string): Promise<string> {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
  
//sha256Hex("Well").then(console.log);

const info = "BTC"

interface Block {
    index: number;
    data: string;
    hash: string;
    previousHash: string;
}

const blocks: Block[] = [];

function genesisBlock(): void {
    const newBlock: Block = {
        index: blocks.length + 1,
        data: info,
        hash: "123",
        previousHash: "000",
    };

    blocks.push(newBlock);
}

genesisBlock();

console.log(blocks);