import { mergeDeep } from '../../lib/utils';

describe('Utils - MergeDeep', () => {
  it('Should return the target when not exists sources', () => {
    const target = { hi: ';)' };
    const result = mergeDeep(target);

    expect(result).toEqual(target);
  });

  it('Should merge objects', () => {
    const result = mergeDeep(
      { a: { y: 6, t: [1] } },
      { b: 2 },
      { a: { x: 5, t: [5] } }
    );

    expect(result).toEqual({
      a: {
        x: 5,
        y: 6,
        t: [5],
      },
      b: 2,
    });
  });
});
