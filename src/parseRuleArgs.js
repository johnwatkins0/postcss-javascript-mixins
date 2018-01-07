/* eslint no-eval: 0 */

export const parseRuleArgs = rule => {
    const file = rule.params.trim();

    const params = rule.nodes
        ? rule.nodes.reduce(
              (output, node) =>
                  Object.assign({}, output, {
                      [node.prop]: node.value
                          .trim()
                          .replace(/^'/, '')
                          .replace(/'$/, ''),
                  }),
              {},
          )
        : {};

    return {
        file,
        params,
    };
};
