import path from 'path';
import fs from 'fs';
import postcss from 'postcss';

import { jsMixins } from '../src';

const getTestFile = file =>
    new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, file), 'utf8', (err, buffer) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(buffer);
        });
    });

test('Parsing works', async done => {
    const testContent = await getTestFile('test-file.css');
    const testResults = await getTestFile('test-file.results.css');
    const processor = postcss(postcss.plugin('spacing-utils', jsMixins));
    const result = await processor.process(testContent, { from: 'undefined' });
    expect(result.toString()).toBe(testResults);
    done();
});

test('Parsing a file importing nonexistent JS throws an error.', async done => {
    const testContent = await getTestFile('test-file-bad-import.css');

    const processor = postcss(postcss.plugin('spacing-utils', jsMixins));

    try {
        await processor.process(testContent, { from: 'undefined' });
    } catch (e) {
        expect(e).toBeTruthy();
    }

    done();
});

test('Parsing a file without the error throws error.', async done => {
    const testContent = await getTestFile('test-file-without-rule.css');

    const processor = postcss(postcss.plugin('spacing-utils', jsMixins));

    try {
        await processor.process(testContent, { from: 'undefined' });
    } catch (e) {
        expect(e).toBe('@js-mixin at rule not found');
    }

    done();
});

test('Passing a rootDir option is handled correctly.', async done => {
    const testContent = await getTestFile('test-file.css');
    const testResults = await getTestFile('test-file.results.css');
    const processor = postcss(
        postcss.plugin('spacing-utils', () =>
            jsMixins({ rootDir: path.resolve(__dirname, '..') }),
        ),
    );
    const result = await processor.process(testContent, { from: 'undefined' });
    expect(result.toString()).toBe(testResults);
    done();
});
