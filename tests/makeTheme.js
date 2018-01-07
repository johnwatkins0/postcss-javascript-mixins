module.exports = ({ themeName }) => {
    if (themeName === 'dark') {
        return `
  color: white;
  background-color: black;
`;
    }

    return '';
};
