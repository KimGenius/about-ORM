const target = `Query.9mdnyru: 3961.918ms
Query.6boi9jc: 7502.765ms
Query.vaaxrxt: 11449.785ms
Query.qb3oh4o: 15441.871ms
Query.mrodi32: 19317.364ms
Query.594zpu4: 23303.651ms
Query.ax91yuq: 26407.461ms
Query.ne84byn: 30242.587ms
Query.no5vi2q: 33405.615ms
Query.ndwggih: 37063.036ms
Query.xl116hq: 35740.837ms
Query.br4idx1: 36387.007ms
Query.d3wzavo: 36742.665ms
Query.oa817ok: 36382.232ms
Query.8evux7k: 36579.290ms
Query.azta1qg: 36671.677ms
Query.95obeg1: 37111.623ms`

const targetList = target.split('\n')
let total = 0.0
for (const t of targetList) {
  const msData = t.split(': ')[1].split('ms')[0]
  total += Number(msData)
}
console.log(total / targetList.length)
