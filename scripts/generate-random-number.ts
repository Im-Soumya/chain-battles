/**
 * This function is only for checking the random numbers generated on the local blockchain.
 * The random numbers are then used in case of testing.
 */

// @ts-ignore
import { ethers } from "hardhat"

async function main() {
    const chainBattles = await ethers.getContract("ChainBattles")
    console.log("Generating random number for strength...")
    const randomNumber = await chainBattles.generateRandom(60)
    console.log(`Strength: ${randomNumber}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })