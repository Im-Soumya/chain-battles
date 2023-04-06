import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ChainBattles } from "../../typechain-types"
// @ts-ignore   
import { network, deployments, ethers }from "hardhat"
import { assert, expect } from "chai"
import { developmentChains } from "../../helper-hardhat-config"

const levelZeroSvg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4KICAgICAgPHN0eWxlPi5iYXNlIHsgZmlsbDogd2hpdGU7IGZvbnQtZmFtaWx5OiBzZXJpZjsgZm9udC1zaXplOiAxNHB4OyB9PC9zdHlsZT4KICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iYmxhY2siIC8+CiAgICAgIDx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+V2FycmlvcjwvdGV4dD4KICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGNsYXNzPSJiYXNlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MZXZlbHM6IDA8L3RleHQ+CiAgICA8L3N2Zz4="
const levelZeroURI = "data:application/json;base64,ewogICAgICAibmFtZSI6ICJDaGFpbiBCYXR0bGVzICMwIiwKICAgICAgImRlc2NyaXB0aW9uIjogIkJhdHRsZXMgb24gY2hhaW4iLAogICAgICAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFFpSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNEtJQ0FnSUNBZ1BITjBlV3hsUGk1aVlYTmxJSHNnWm1sc2JEb2dkMmhwZEdVN0lHWnZiblF0Wm1GdGFXeDVPaUJ6WlhKcFpqc2dabTl1ZEMxemFYcGxPaUF4TkhCNE95QjlQQzl6ZEhsc1pUNEtJQ0FnSUNBZ1BISmxZM1FnZDJsa2RHZzlJakV3TUNVaUlHaGxhV2RvZEQwaU1UQXdKU0lnWm1sc2JEMGlZbXhoWTJzaUlDOCtDaUFnSUNBZ0lEeDBaWGgwSUhnOUlqVXdKU0lnZVQwaU5EQWxJaUJqYkdGemN6MGlZbUZ6WlNJZ1pHOXRhVzVoYm5RdFltRnpaV3hwYm1VOUltMXBaR1JzWlNJZ2RHVjRkQzFoYm1Ob2IzSTlJbTFwWkdSc1pTSStWMkZ5Y21sdmNqd3ZkR1Y0ZEQ0S0lDQWdJQ0FnUEhSbGVIUWdlRDBpTlRBbElpQjVQU0kxTUNVaUlHTnNZWE56UFNKaVlYTmxJaUJrYjIxcGJtRnVkQzFpWVhObGJHbHVaVDBpYldsa1pHeGxJaUIwWlhoMExXRnVZMmh2Y2owaWJXbGtaR3hsSWo1TVpYWmxiSE02SURBOEwzUmxlSFErQ2lBZ0lDQThMM04yWno0PSIsCn0="

!developmentChains.includes(network.name)
? describe.skip
: describe("Chain Battles unit tests", () => {
    let chainBattles: ChainBattles
    let chainBattlesContract: ChainBattles
    let accounts: SignerWithAddress[]
    let deployer: SignerWithAddress
    let player: SignerWithAddress

    beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        player = accounts[1]

        await deployments.fixture(["chainbattles"])
        chainBattlesContract = await ethers.getContract("ChainBattles")
        chainBattles = chainBattlesContract.connect(deployer)
    })

    describe("generateCharacter", () => {
        it("correctly sets the value", async () => {
            const svg = await chainBattles.generateCharacter(0)
            assert(svg, levelZeroSvg)
        })
    })

    describe("getLevels", () => {
        it("returns correct level of NFT", async () => {
            await chainBattles.generateCharacter(0)
            const level = await chainBattles.getLevels(0)
            assert(level, "0")
        })
    })

    describe("getTokenURI", () => {
        it("returns correct tokenURI", async () => {
            await chainBattles.generateCharacter(0)
            const tokenURI = await chainBattles.getTokenURI(0)
            assert(tokenURI, levelZeroURI)
        })
    })

    describe("mint", () => {
        it("mints an NFT", async () => {
            expect(await chainBattles.mint()).to.emit(chainBattles, "NFTMinted")
            const levelAfterMint = await chainBattles.getLevels(0)
            assert(levelAfterMint, "0")
            const tokenCounter = await chainBattles.getTokenCounter()
            assert(tokenCounter, "1")
            const tokenURI = await chainBattles.tokenURI(1)
            assert(tokenURI, levelZeroURI)
        })
    })

    describe("train", () => {
        beforeEach(async () => {
            await chainBattles.mint()
        })
        it("reverts if not owner", async () => {
            chainBattles = chainBattlesContract.connect(player)
            await expect(chainBattles.train(1)).to.be.revertedWith("ChainBattles__NotOwner")
        })
        it("reverts if not exists", async () => {
            await expect(chainBattles.train(2)).to.be.revertedWith("ChainBattles__TokenNotExists")
        })
        it("levels up the NFT", async () => {
            const id = await chainBattles.getTokenCounter()
            const levelBeforeTraining = await chainBattles.getLevels(id)
            await chainBattles.train(id)
            const levelAfterTraining = await chainBattles.getLevels(id)
            assert(levelBeforeTraining, "0")
            assert(levelAfterTraining, "1")
        })
    })
})