import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import verify from "../utils/verify";
import { developmentChains } from "../helper-hardhat-config";

const deployChainBattles: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("-------------------------------")
    
    const chainBattles = await deploy("ChainBattles", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 5
    })
    
    log("-------------------------------")

    if(!developmentChains.includes(network.name) && process.env.POLYSCAN_API_KEY) {
        await verify(chainBattles.address, [])
    }
}

export default deployChainBattles

deployChainBattles.tags = ["all", "chainbattles"]