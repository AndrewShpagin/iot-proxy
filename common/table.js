/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */

function sqr(x) {
  return x * x;
}
class SandboxTable {
  constructor(name) {
    this.lastrow = 0;
    this.lastcolumn = 0;
    this.name = name;
    this.table = {};
  }

  get(r, c) {
    const tr = this.table[r];
    if (tr) {
      const tc = tr[c];
      if (tc) return tc;
    }
    return '';
  }

  set(r, c, value) {
    if (r <= 2048 && c <= 32) {
      let tr = this.table[r];
      if (!tr) {
        this.table[r] = {};
        tr = this.table[r];
      }
      tr[c] = value;
      if (c > this.lastcolumn) this.lastcolumn = c;
      if (r > this.lastrow) this.lastrow = r;
    }
  }

  delRow(r) {
    if (r > 0) {
      for (let i = r; i <= this.lastrow; i++) {
        const rr = this.table[i + 1];
        if (this.table[i]) delete (this.table[i]);
        if (rr) this.table[i] = rr;
      }
      if (this.lastrow >= r) this.lastrow--;
    }
  }

  delColumn(c) {
    for (const [row, rowValues] of Object.entries(this.table)) {
      const row1 = {};
      let ch = false;
      for (const [col, value] of Object.entries(rowValues)) {
        if (col < c)row1[col] = value;
        if (col === c) ch = true;
        if (col > c) {
          row1[col - 1] = value;
          ch = true;
        }
      }
      if (ch) this.table[row] = row1;
    }
  }

  clearRange(r0, c0, r1, c1) {
    for (let r = r0; r <= r1; r++) {
      const row = this.table[r];
      if (row) {
        for (let c = c0; c <= c1; c++) {
          if (row[c]) delete row[c];
        }
      }
    }
  }

  valid(x) {
    return x < 10000000000 && x > -10000000000 ? x : 0;
  }

  cellsOperate(r0, c0, r1, c1, init, func) {
    let initial = init;
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) { initial = func(initial, this.get(r, c)); }
    }
    return this.valid(initial);
  }

  summCells(r0, c0, r1, c1) {
    return this.cellsOperate(r0, c0, r1, c1, 0, (summ, value) => summ + Number(value));
  }

  concatenateCells(r0, c0, r1, c1) {
    return this.cellsOperate(r0, c0, r1, c1, '', (summ, value) => summ + value);
  }

  productCells(r0, c0, r1, c1) {
    return this.cellsOperate(r0, c0, r1, c1, 1.0, (summ, value) => summ * Number(value));
  }

  maxInCells(r0, c0, r1, c1) {
    return this.cellsOperate(r0, c0, r1, c1, -20000000000, (summ, value) => Math.max(summ, Number(value)));
  }

  minInCells(r0, c0, r1, c1) {
    return this.cellsOperate(r0, c0, r1, c1, 20000000000, (summ, value) => Math.min(summ, Number(value)));
  }

  countFilledCells(r0, c0, r1, c1) {
    return this.cellsOperate(r0, c0, r1, c1, 0.0, (summ, value) => (value === '' ? summ : summ + 1));
  }

  averageInCells(r0, c0, r1, c1) {
    return this.summCells(r0, c0, r1, c1) / this.countFilledCells(r0, c0, r1, c1);
  }

  deviationInCells(r0, c0, r1, c1) {
    const av = this.averageInCells(r0, c0, r1, c1);
    return this.valid(Math.sqrt(this.cellsOperate(r0, c0, r1, c1, 0.0, (summ, value) => summ + sqr(Number(value) - av)) / this.countFilledCells(r0, c0, r1, c1)));
  }

  getLastRow() {
    return this.lastrow;
  }
}
module.exports = { SandboxTable };
