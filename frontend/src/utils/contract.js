export const heritageAddress = "0xB16b23091F306d923c2F63bdC7Be1086b92D5903"

export const heritageAbi = [
    "function checkUpKeep(bytes) view returns(bool, bytes)",
    "function getHeritage(address) view returns(tuple(address, address, address[], uint256, uint256, bool))",
    "function getHeritageTokens(address) view returns(address[])",
    "function hasHeritage(address) view returns(bool)",
    "function create(address, uint256)",
    "function addTokens(address[] _tokens)",
    "function checkIn()",
    "function cancel()",
    "function performUpKeep(bytes)",
    "function update(address, uint256)",
    "function updateCheckInterval(uint)",
    "function updateHeir(address)"
]