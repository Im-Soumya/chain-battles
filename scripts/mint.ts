// @ts-ignore
import { ethers } from "hardhat"

async function main() {
    const chainBattles = await ethers.getContract("ChainBattles")
    console.log("Minting...")
    await chainBattles.mint()
    console.log("Minted")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })