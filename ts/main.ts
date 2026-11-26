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
      data: info,
      hash,
      previousHash: previousBlock.hash,
    });
}

const addBtn = document.getElementById("add-btn");

addBtn?.addEventListener("click", async () => {
    await addBlock();
    console.table(blocks);
});

async function isChainValid(): Promise<boolean> {
    for (let i = 0; i < blocks.length; i++) {
      const current = blocks[i];
  
      // Проверка 1: содержимое не менялось
      const recalculated = await calculateHash(current.index, current.data, current.previousHash);
      if (current.hash !== recalculated) {
        console.log("Блок " + i + " изменён: хеш не совпадает с содержимым");
        return false;
      }
  
      // Проверка 2: связь с предыдущим блоком (у генезиса предыдущего нет)
      if (i > 0 && current.previousHash !== blocks[i - 1].hash) {
        console.log("Цепочка порвана между блоками " + (i - 1) + " и " + i);
        return false;
      }
    }
  
    return true;
}

let lastState: boolean | null = null;

async function monitorChain(): Promise<void> {
  const ok = await isChainValid();
  if (ok !== lastState) {
    console.log(ok ? "Цепочка целая" : "Цепочка нарушена!");
    lastState = ok;
  }
  setTimeout(monitorChain, 2000);
}

async function run(): Promise<void> {
    await genesisBlock();
    monitorChain();
    console.log(blocks);
}
  
run();