import { unparenthesize } from './utils/unparenthesize';

export const parseRuleArgs = rule => {
    const file = unparenthesize(rule.params).replace(/'/g, '');
    const params = rule.nodes.reduce(
        (output, node) =>
            Object.assign({}, output, { [node.prop]: node.value }),
        {},
    );

    return {
        file,
        params,
    };
};
