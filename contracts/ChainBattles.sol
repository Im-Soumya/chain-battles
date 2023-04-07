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

  struct Details {
    uint256 level;
    uint256 strength;
    uint256 attack;
    uint256 speed;
    uint256 life;
  }

  Counters.Counter private _tokenIds;
  mapping(uint256 => Details) public tokenIdToDetails;

  event NFTMinted(uint256 indexed tokenId);

  constructor() ERC721("Chain Battles", "CBTLS") {}

  function generateRandom(uint256 number) public view returns (uint256) {
    return
      uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % number;
  }

  function generateCharacter(uint256 _tokenId) public view returns (string memory) {
    bytes memory svg = abi.encodePacked(
      '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
      "<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
      '<rect width="100%" height="100%" fill="black" />',
      '<text x="50%" y="30%" class="base" dominant-baseline="middle" text-anchor="middle">',
      "Warrior",
      "</text>",
      '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
      "Levels: ",
      getLevel(_tokenId),
      "</text>",
      '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
      "Strength: ",
      getStrength(_tokenId),
      "</text>",
      '<text x="50%" y="60%" class="base" dominant-baseline="middle" text-anchor="middle">',
      "Attack: ",
      getAttack(_tokenId),
      "</text>",
      '<text x="50%" y="70%" class="base" dominant-baseline="middle" text-anchor="middle">',
      "Speed: ",
      getSpeed(_tokenId),
      "</text>",
      '<text x="50%" y="80%" class="base" dominant-baseline="middle" text-anchor="middle">',
      "Life: ",
      getLife(_tokenId),
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
    tokenIdToDetails[newItemTokenId] = Details(
      0,
      generateRandom(200),
      generateRandom(100),
      generateRandom(60),
      generateRandom(100)
    );
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

    Details storage details = tokenIdToDetails[_tokenId];
    details.level += 1;
    details.strength += 10;
    details.attack += 10;
    details.speed += 7;
    details.life += 3;
    _setTokenURI(_tokenId, getTokenURI(_tokenId));
  }

  function getTokenCounter() public view returns (uint256) {
    return _tokenIds.current();
  }

  function getDetails(uint256 _tokenId) public view returns (Details memory details) {
    return details = tokenIdToDetails[_tokenId];
  }

  function getLevel(uint256 _tokenId) public view returns (string memory) {
    Details memory details = tokenIdToDetails[_tokenId];
    return details.level.toString();
  }

  function getStrength(uint256 _tokenId) public view returns (string memory) {
    Details memory details = tokenIdToDetails[_tokenId];
    return details.strength.toString();
  }

  function getSpeed(uint256 _tokenId) public view returns (string memory) {
    Details memory details = tokenIdToDetails[_tokenId];
    return details.speed.toString();
  }

  function getAttack(uint256 _tokenId) public view returns (string memory) {
    Details memory details = tokenIdToDetails[_tokenId];
    return details.attack.toString();
  }

  function getLife(uint256 _tokenId) public view returns (string memory) {
    Details memory details = tokenIdToDetails[_tokenId];
    return details.life.toString();
  }
}
