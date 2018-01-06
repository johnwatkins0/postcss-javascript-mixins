import path from 'path';

import { findProjectRoot } from './findProjectRoot';
import { parseRuleArgs } from './parseRuleArgs';

const getFile = ({ opts, args }) =>
    new Promise(async resolve => {
        if (opts.rootDir) {
            resolve(path.resolve(opts.rootDir, args.file));
        } else {
            const projectRoot = await findProjectRoot();
            resolve(path.resolve(projectRoot, args.file));
        }
    });

export const jsMixins = (opts = {}) => (root, result) =>
    new Promise((resolve, reject) => {
        if (root.source.input.css.indexOf('@js-mixin') === -1) {
            result.warn('@js-mixin at rule not found');
            reject('@js-mixin at rule not found');
            return;
        }

        root.walkAtRules('js-mixin', async rule => {
            const args = parseRuleArgs(rule);
            const file = await getFile({ opts, args });

            let func;
            try {
                func = require(file);
            } catch (e) {
                result.warn(`${file} not found.`);
                resolve();
                return;
            }

            let css = func(args.params);
            rule.before(css);
            rule.remove();
            resolve();
        });
    });
