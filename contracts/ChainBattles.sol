// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

error ChainBattles__TokenNotExists();
error ChainBattles__NotOwner();

contract ChainBattles is ERC721URIStorage {
  using Strings for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;
  mapping(uint256 => uint256) public tokenIdToLevels;

  event NFTMinted(uint256 indexed tokenId);

  constructor() ERC721("Chain Battles", "CBTLS") {}

  function generateCharacter(uint256 _tokenId) public view returns (string memory) {
    bytes memory svg = abi.encodePacked(
      '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
      "<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
      '<rect width="100%" height="100%" fill="black" />',
      '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
      "Warrior",
      "</text>",
      '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
      "Levels: ",
      getLevels(_tokenId),
      "</text>",
      "</svg>"
    );

    return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
  }

  function getTokenURI(uint256 _tokenId) public view returns (string memory) {
    bytes memory dataURI = abi.encodePacked(
      "{",
      '"name": "Chain Battles #',
      _tokenId.toString(),
      '",',
      '"description": "Battles on chain",',
      '"image": "',
      generateCharacter(_tokenId),
      '"',
      "}"
    );

    return string(abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI)));
  }

  function mint() public {
    _tokenIds.increment();
    uint256 newItemTokenId = _tokenIds.current();
    _safeMint(msg.sender, newItemTokenId);
    tokenIdToLevels[newItemTokenId] = 0;
    _setTokenURI(newItemTokenId, getTokenURI(newItemTokenId));

    emit NFTMinted(newItemTokenId);
  }

  function train(uint256 _tokenId) public {
    if (!_exists(_tokenId)) {
      revert ChainBattles__TokenNotExists();
    }
    if (!(ownerOf(_tokenId) == msg.sender)) {
      revert ChainBattles__NotOwner();
    }

    uint256 currentLevel = tokenIdToLevels[_tokenId];
    tokenIdToLevels[_tokenId] = currentLevel + 1;
    _setTokenURI(_tokenId, getTokenURI(_tokenId));
  }

  function getTokenCounter() public view returns (uint256) {
    return _tokenIds.current();
  }

  function getLevels(uint256 _tokenId) public view returns (string memory) {
    uint256 levels = tokenIdToLevels[_tokenId];
    return levels.toString();
  }
}
