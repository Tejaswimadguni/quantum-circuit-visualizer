/**
 * Validates execution payload shape matches UI expectations (no mock data).
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(
  readFileSync(join(__dirname, 'fixtures', 'test1_h.json'), 'utf-8')
);

const errors = [];
const step = fixture.steps[0];

if (step.stateBefore === step.stateAfter) {
  errors.push('stateBefore must differ from stateAfter');
}
if (!step.stateBefore.includes('0')) {
  errors.push('stateBefore should represent |0>');
}
if (!step.stateAfter.includes('0.707')) {
  errors.push('stateAfter should show superposition amplitudes');
}
if (step.probabilitiesBefore['0'] !== 1) {
  errors.push('probabilitiesBefore[0] should be 1');
}
if (step.probabilitiesAfter['0'] !== 0.5 || step.probabilitiesAfter['1'] !== 0.5) {
  errors.push('probabilitiesAfter should be 50/50');
}
const bloch = step.blochVectorsAfter[0];
if (!(Math.abs(bloch[0] - 1) < 0.01 && Math.abs(bloch[2]) < 0.01)) {
  errors.push(`blochVectorsAfter should be ~[1,0,0], got ${JSON.stringify(bloch)}`);
}
if (!fixture.executionTime || fixture.executionTime === 'Pending') {
  errors.push('executionTime must be measured, not Pending');
}

if (errors.length) {
  console.error('FRONTEND FIXTURE FAIL:');
  errors.forEach((e) => console.error(' -', e));
  process.exit(1);
}

console.log('FRONTEND FIXTURE PASS: test1_h.json matches UI contract');
console.log('  executionTime:', fixture.executionTime);
console.log('  bloch q0:', bloch);
