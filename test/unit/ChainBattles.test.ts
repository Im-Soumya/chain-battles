import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ChainBattles } from "../../typechain-types"
// @ts-ignore   
import { network, deployments, ethers }from "hardhat"
import { assert, expect } from "chai"
import { developmentChains } from "../../helper-hardhat-config"

// Local chain specfic svgs and uris
const levelZeroSvg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4KICAgICAgPHN0eWxlPi5iYXNlIHsgZmlsbDogd2hpdGU7IGZvbnQtZmFtaWx5OiBzZXJpZjsgZm9udC1zaXplOiAxNHB4OyB9PC9zdHlsZT4KICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iYmxhY2siIC8+CiAgICAgIDx0ZXh0IHg9IjUwJSIgeT0iMzAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+V2FycmlvcjwvdGV4dD4KICAgICAgPHRleHQgeD0iNTAlIiB5PSI0MCUiIGNsYXNzPSJiYXNlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MZXZlbHM6IDA8L3RleHQ+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U3RyZW5ndGg6IDMyPC90ZXh0Pgo8dGV4dCB4PSI1MCUiIHk9IjYwJSIgY2xhc3M9ImJhc2UiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF0dGFjazogMzI8L3RleHQ+Cjx0ZXh0IHg9IjUwJSIgeT0iNzAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U3BlZWQ6IDEyPC90ZXh0Pgo8dGV4dCB4PSI1MCUiIHk9IjgwJSIgY2xhc3M9ImJhc2UiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxpZmU6IDMyPC90ZXh0PgogICAgPC9zdmc+"
const levelZeroURI = "data:application/json;base64,ewogICAgICAibmFtZSI6ICJDaGFpbiBCYXR0bGVzICMwIiwKICAgICAgImRlc2NyaXB0aW9uIjogIkJhdHRsZXMgb24gY2hhaW4iLAogICAgICAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFFpSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNEtJQ0FnSUNBZ1BITjBlV3hsUGk1aVlYTmxJSHNnWm1sc2JEb2dkMmhwZEdVN0lHWnZiblF0Wm1GdGFXeDVPaUJ6WlhKcFpqc2dabTl1ZEMxemFYcGxPaUF4TkhCNE95QjlQQzl6ZEhsc1pUNEtJQ0FnSUNBZ1BISmxZM1FnZDJsa2RHZzlJakV3TUNVaUlHaGxhV2RvZEQwaU1UQXdKU0lnWm1sc2JEMGlZbXhoWTJzaUlDOCtDaUFnSUNBZ0lEeDBaWGgwSUhnOUlqVXdKU0lnZVQwaU16QWxJaUJqYkdGemN6MGlZbUZ6WlNJZ1pHOXRhVzVoYm5RdFltRnpaV3hwYm1VOUltMXBaR1JzWlNJZ2RHVjRkQzFoYm1Ob2IzSTlJbTFwWkdSc1pTSStWMkZ5Y21sdmNqd3ZkR1Y0ZEQ0S0lDQWdJQ0FnUEhSbGVIUWdlRDBpTlRBbElpQjVQU0kwTUNVaUlHTnNZWE56UFNKaVlYTmxJaUJrYjIxcGJtRnVkQzFpWVhObGJHbHVaVDBpYldsa1pHeGxJaUIwWlhoMExXRnVZMmh2Y2owaWJXbGtaR3hsSWo1TVpYWmxiSE02SURBOEwzUmxlSFErQ2p4MFpYaDBJSGc5SWpVd0pTSWdlVDBpTlRBbElpQmpiR0Z6Y3owaVltRnpaU0lnWkc5dGFXNWhiblF0WW1GelpXeHBibVU5SW0xcFpHUnNaU0lnZEdWNGRDMWhibU5vYjNJOUltMXBaR1JzWlNJK1UzUnlaVzVuZEdnNklETXlQQzkwWlhoMFBnbzhkR1Y0ZENCNFBTSTFNQ1VpSUhrOUlqWXdKU0lnWTJ4aGMzTTlJbUpoYzJVaUlHUnZiV2x1WVc1MExXSmhjMlZzYVc1bFBTSnRhV1JrYkdVaUlIUmxlSFF0WVc1amFHOXlQU0p0YVdSa2JHVWlQa0YwZEdGamF6b2dNekk4TDNSbGVIUStDangwWlhoMElIZzlJalV3SlNJZ2VUMGlOekFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krVTNCbFpXUTZJREV5UEM5MFpYaDBQZ284ZEdWNGRDQjRQU0kxTUNVaUlIazlJamd3SlNJZ1kyeGhjM005SW1KaGMyVWlJR1J2YldsdVlXNTBMV0poYzJWc2FXNWxQU0p0YVdSa2JHVWlJSFJsZUhRdFlXNWphRzl5UFNKdGFXUmtiR1VpUGt4cFptVTZJRE15UEM5MFpYaDBQZ29nSUNBZ1BDOXpkbWMrIiwKfQ=="

const levelOneSvg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4KICAgICAgPHN0eWxlPi5iYXNlIHsgZmlsbDogd2hpdGU7IGZvbnQtZmFtaWx5OiBzZXJpZjsgZm9udC1zaXplOiAxNHB4OyB9PC9zdHlsZT4KICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iYmxhY2siIC8+CiAgICAgIDx0ZXh0IHg9IjUwJSIgeT0iMzAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+V2FycmlvcjwvdGV4dD4KICAgICAgPHRleHQgeD0iNTAlIiB5PSI0MCUiIGNsYXNzPSJiYXNlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MZXZlbHM6IDE8L3RleHQ+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U3RyZW5ndGg6IDQyPC90ZXh0Pgo8dGV4dCB4PSI1MCUiIHk9IjYwJSIgY2xhc3M9ImJhc2UiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF0dGFjazogNDI8L3RleHQ+Cjx0ZXh0IHg9IjUwJSIgeT0iNzAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U3BlZWQ6IDE5PC90ZXh0Pgo8dGV4dCB4PSI1MCUiIHk9IjgwJSIgY2xhc3M9ImJhc2UiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxpZmU6IDM1PC90ZXh0PgogICAgPC9zdmc+"
const levelOneURI = "data:application/json;base64,ewogICAgICAibmFtZSI6ICJDaGFpbiBCYXR0bGVzICMwIiwKICAgICAgImRlc2NyaXB0aW9uIjogIkJhdHRsZXMgb24gY2hhaW4iLAogICAgICAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFFpSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNEtJQ0FnSUNBZ1BITjBlV3hsUGk1aVlYTmxJSHNnWm1sc2JEb2dkMmhwZEdVN0lHWnZiblF0Wm1GdGFXeDVPaUJ6WlhKcFpqc2dabTl1ZEMxemFYcGxPaUF4TkhCNE95QjlQQzl6ZEhsc1pUNEtJQ0FnSUNBZ1BISmxZM1FnZDJsa2RHZzlJakV3TUNVaUlHaGxhV2RvZEQwaU1UQXdKU0lnWm1sc2JEMGlZbXhoWTJzaUlDOCtDaUFnSUNBZ0lEeDBaWGgwSUhnOUlqVXdKU0lnZVQwaU16QWxJaUJqYkdGemN6MGlZbUZ6WlNJZ1pHOXRhVzVoYm5RdFltRnpaV3hwYm1VOUltMXBaR1JzWlNJZ2RHVjRkQzFoYm1Ob2IzSTlJbTFwWkdSc1pTSStWMkZ5Y21sdmNqd3ZkR1Y0ZEQ0S0lDQWdJQ0FnUEhSbGVIUWdlRDBpTlRBbElpQjVQU0kwTUNVaUlHTnNZWE56UFNKaVlYTmxJaUJrYjIxcGJtRnVkQzFpWVhObGJHbHVaVDBpYldsa1pHeGxJaUIwWlhoMExXRnVZMmh2Y2owaWJXbGtaR3hsSWo1TVpYWmxiSE02SURFOEwzUmxlSFErQ2p4MFpYaDBJSGc5SWpVd0pTSWdlVDBpTlRBbElpQmpiR0Z6Y3owaVltRnpaU0lnWkc5dGFXNWhiblF0WW1GelpXeHBibVU5SW0xcFpHUnNaU0lnZEdWNGRDMWhibU5vYjNJOUltMXBaR1JzWlNJK1UzUnlaVzVuZEdnNklEUXlQQzkwWlhoMFBnbzhkR1Y0ZENCNFBTSTFNQ1VpSUhrOUlqWXdKU0lnWTJ4aGMzTTlJbUpoYzJVaUlHUnZiV2x1WVc1MExXSmhjMlZzYVc1bFBTSnRhV1JrYkdVaUlIUmxlSFF0WVc1amFHOXlQU0p0YVdSa2JHVWlQa0YwZEdGamF6b2dOREk4TDNSbGVIUStDangwWlhoMElIZzlJalV3SlNJZ2VUMGlOekFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krVTNCbFpXUTZJREU1UEM5MFpYaDBQZ284ZEdWNGRDQjRQU0kxTUNVaUlIazlJamd3SlNJZ1kyeGhjM005SW1KaGMyVWlJR1J2YldsdVlXNTBMV0poYzJWc2FXNWxQU0p0YVdSa2JHVWlJSFJsZUhRdFlXNWphRzl5UFNKdGFXUmtiR1VpUGt4cFptVTZJRE0xUEM5MFpYaDBQZ29nSUNBZ1BDOXpkbWMrIiwKfQ=="

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
            const tokenId = await chainBattles.getTokenCounter()
            const svg = await chainBattles.generateCharacter(tokenId)
            assert(svg, levelZeroSvg)
        })
    })

    describe("getDetails", () => {
        it("returns the NFT details", async () => {
            const tokenId = await chainBattles.getTokenCounter()
            const details = await chainBattles.getDetails(tokenId)
            assert(details[0], "0")
            // only for local hardhat not for any testnet
            assert(details[1], "32") 
            assert(details[2], "32")
            assert(details[3], "12")
            assert(details[4], "32")
        })
    })

    describe("getLevel", () => {
        it("returns correct level of NFT", async () => {
            const tokenId = await chainBattles.getTokenCounter()
            await chainBattles.generateCharacter(tokenId)
            const level = await chainBattles.getLevel(tokenId)
            assert(level, "0")
        })
    })

    describe("getTokenURI", () => {
        it("returns correct tokenURI", async () => {
            const tokenId = await chainBattles.getTokenCounter()
            await chainBattles.generateCharacter(tokenId)
            const tokenURI = await chainBattles.getTokenURI(tokenId)
            assert(tokenURI, levelZeroURI)
        })
    })

    describe("mint", () => {
        it("emits an event on minting", async () => {
            expect(await chainBattles.mint()).to.emit(chainBattles, "NFTMinted")
        })
        it("initializes the NFT correctly", async () => {
            await chainBattles.mint()
            const tokenId = await chainBattles.getTokenCounter()
            const nftDetails = await chainBattles.getDetails(tokenId)
            const level = nftDetails[0]
            assert(level, "0")
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
            const detailsBeforeTraining = await chainBattles.getDetails(id)
            const  levelBefore = detailsBeforeTraining[0]
            const  strengthBefore = detailsBeforeTraining[1]
            const  attackBefore = detailsBeforeTraining[2]
            const  speedBefore = detailsBeforeTraining[3]
            const  lifeBefore = detailsBeforeTraining[4]

            await chainBattles.train(id)
            const detailsAfterTraining = await chainBattles.getDetails(id)
            const levelAfter = detailsAfterTraining[0]
            const strengthAfter = detailsAfterTraining[1]
            const attackAfter = detailsAfterTraining[2]
            const speedAfter = detailsAfterTraining[3]
            const lifeAfter = detailsAfterTraining[4]

            assert(levelBefore, "0")
            assert(levelAfter, "1")
            assert(strengthBefore, "32")
            assert(strengthAfter, "42")
            assert(attackBefore, "32")
            assert(attackAfter, "42")
            assert(speedBefore, "12")
            assert(speedAfter, "19")
            assert(lifeBefore, "32")
            assert(lifeAfter, "35")
        })
        it("updates the tokenURI", async () => {
            const id = await chainBattles.getTokenCounter()
            const beforeSvg = await chainBattles.generateCharacter(id)
            const beforeTokenURI = await chainBattles.getTokenURI(id)
            await chainBattles.train(id)
            const afterSvg = await chainBattles.generateCharacter(id)
            const afterTokenURI = await chainBattles.getTokenURI(id)
            
            assert(beforeSvg, levelZeroSvg)
            assert(afterSvg, levelOneSvg)
            assert(beforeTokenURI, levelZeroURI)
            assert(afterTokenURI, levelOneURI)
        })
    })
})