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

const calculateHash = async (index: number, data: string, previousHash: string): Promise<string> => {
    const forHash = `${index}${data}${previousHash}`;
    return await sha256Hex(forHash);
};
  
async function genesisBlock(): Promise<void> {
    const index = 1;
    const previousHash = "000";
    const hash = await calculateHash(index, info, previousHash);
  
    blocks.push({
      index,
      data: info,
      hash,
      previousHash,
    });
}

async function addBlock(): Promise<void> {
    const previousBlock = blocks[blocks.length - 1];
    const index = blocks.length + 1;
    const hash = await calculateHash(index, info, previousBlock.hash);
  
    blocks.push({
      index,
      info,
      hash,
      previousHash: previousBlock.hash,
    });
}

async function run(): Promise<void> {
    await genesisBlock();
    await addBlock();
    await addBlock();
    await addBlock();
    console.log(blocks);
}
  
run();