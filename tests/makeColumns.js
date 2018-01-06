module.exports = ({ columnCount }) => {
    let output = '';
    for (let i = 1; i <= columnCount; i += 1) {
        output += `
.col-${i} {
  width: ${100 / columnCount * i}%;
}
`;
    }

    return output;
};
