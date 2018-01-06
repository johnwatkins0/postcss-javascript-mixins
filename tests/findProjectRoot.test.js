import path from 'path';

import { findProjectRoot } from '../src/findProjectRoot';

test('The root dir is found.', async done => {
    const rootDir = await findProjectRoot();
    expect(rootDir).toBe(path.resolve(__dirname, '..'));
    done();
});

test('Passing a nonexistent dir results in an error.', async done => {
    try {
        await findProjectRoot('not-a-dir');
        done();
    } catch (e) {
        expect(e).toBe('The project root could not be found.');
        done();
    }
});
