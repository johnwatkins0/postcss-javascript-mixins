import path from 'path';
import stylelint from 'stylelint';
import postcss from 'postcss';

import { findProjectRoot } from './findProjectRoot';
import { parseRuleArgs } from './parseRuleArgs';

const getFile = ({ opts, file }) =>
    new Promise(async resolve => {
        if (opts.rootDir) {
            resolve(path.resolve(opts.rootDir, file));
        } else {
            const projectRoot = await findProjectRoot();
            resolve(path.resolve(projectRoot, file));
        }
    });

export const jsMixins = (opts = {}) => (root, result) =>
    new Promise((resolve, reject) => {
        const atRuleCount = root.source.input.css.split('@js-mixin').length - 1;

        if (atRuleCount === 0) {
            result.warn('@js-mixin at rule not found');
            reject('@js-mixin at rule not found');
            return;
        }

        let steps = 0;
        root.walkAtRules('js-mixin', async rule => {
            rule.raw.semicolon = true;
            const args = parseRuleArgs(rule);
            const file = await getFile({ opts, file: args.file });

            let func;
            try {
                func = require(file);
            } catch (e) {
                result.warn(`${file} not found.`);
                steps += 1;
                return;
            }

            let css = func(args.params);

            const lintedCss = await stylelint.lint({
                code: css,
                fix: true,
                config: {
                    extends: 'stylelint-config-standard',
                },
            });

            const nodes = postcss.parse(lintedCss.output).nodes.map(node => {
                node.raws.before = '\n  ';
                node.raws.after = '\n';
                node.raws.semicolon = true;

                return node;
            });

            rule.parent.insertBefore(rule, nodes);
            rule.parent.removeChild(rule);

            steps += 1;
        });

        const completionInterval = setInterval(() => {
            if (steps === atRuleCount) {
                clearInterval(completionInterval);
                resolve();
            }
        }, 1000);
    });

const plugin = postcss.plugin('javascript-mixins', jsMixins);

export default plugin;
