// @ts-ignore
import { ethers } from "hardhat"

async function main() {
    const chainBattles = await ethers.getContract("ChainBattles")   
    const tokenId = await chainBattles.getTokenCounter()
    
    console.log("Training...")
    await chainBattles.train(tokenId)
    console.log("Training completed.")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })