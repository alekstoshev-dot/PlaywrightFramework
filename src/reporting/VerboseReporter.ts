import type { Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { redact } from './redact';

export default class VerboseReporter implements Reporter {
  private logs = new Map<TestResult, string[]>();
  private label(test: TestCase, result: TestResult) {
    return `${test.parent.project()?.name || 'unknown'} | worker=${result.workerIndex} | retry=${result.retry}`;
  }
  private emit(test: TestCase, result: TestResult, message: string) {
    const line = redact(`${new Date().toISOString()} [${this.label(test, result)}] ${message}`);
    this.logs.get(result)?.push(line);
    console.log(line);
  }
  onTestBegin(test: TestCase, result: TestResult) {
    this.logs.set(result, []);
    this.emit(test, result, `TEST START ${test.title}`);
  }
  onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
    this.emit(test, result, `START [${step.category}] ${step.titlePath().join(' > ')}`);
  }
  onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
    const skipped = step.error?.message?.includes('Test is skipped:');
    this.emit(
      test,
      result,
      `${skipped ? 'SKIP' : step.error ? 'FAIL' : 'END'} [${step.category}] ${step.titlePath().join(' > ')} (${step.duration} ms)`,
    );
    if (step.error && !skipped)
      this.emit(test, result, `ERROR ${step.error.message || step.error.value || 'Unknown error'}`);
  }
  onTestEnd(test: TestCase, result: TestResult) {
    for (const error of result.errors)
      this.emit(test, result, `TEST ERROR ${error.message || error.value || 'Unknown error'}`);
    this.emit(test, result, `TEST END ${test.title}: ${result.status} (${result.duration} ms)`);
    const body = Buffer.from((this.logs.get(result) || []).join('\n') + '\n');
    const outputDir = join(
      test.parent.project()?.outputDir || 'portfolio-results',
      `verbose-${test.id.replace(/[^a-zA-Z0-9_-]/g, '_')}-retry-${result.retry}`,
    );
    mkdirSync(outputDir, { recursive: true });
    const path = join(outputDir, 'verbose.log');
    writeFileSync(path, body);
    // This reporter runs before Allure so the same result includes the attachment.
    result.attachments.push({ name: 'verbose-log', contentType: 'text/plain', path });
    this.logs.delete(result);
  }
}
