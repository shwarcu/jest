/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {CoverageMapData} from 'istanbul-lib-coverage';

export type ValidTestReturnValues = void | undefined;
type TestReturnValuePromise = Promise<unknown>;
type TestReturnValueGenerator = Generator<void, unknown, void>;
export type TestReturnValue = ValidTestReturnValues | TestReturnValuePromise;

export type TestContext = Record<string, unknown>;

export type DoneFn = (reason?: string | Error) => void;

export type DoneTakingTestFn = (
  this: TestContext,
  done: DoneFn,
) => ValidTestReturnValues;
export type PromiseReturningTestFn = (this: TestContext) => TestReturnValue;
export type GeneratorReturningTestFn = (
  this: TestContext,
) => TestReturnValueGenerator;

// eslint-disable-next-line @typescript-eslint/ban-types
export type NameLike = number | Function;

export type TestName = string;
export type TestNameLike = TestName | NameLike;
export type TestFn =
  | PromiseReturningTestFn
  | GeneratorReturningTestFn
  | DoneTakingTestFn;
export type ConcurrentTestFn = () => TestReturnValuePromise;
export type BlockFn = () => void;
export type BlockName = string;
export type BlockNameLike = BlockName | NameLike;

export type HookFn = TestFn;

export type Col = unknown;
export type Row = ReadonlyArray<Col>;
export type Table = ReadonlyArray<Row>;
export type ArrayTable = Table | Row;
export type TemplateTable = TemplateStringsArray;
export type TemplateData = ReadonlyArray<unknown>;
export type EachTable = ArrayTable | TemplateTable;

export type TestCallback = BlockFn | TestFn | ConcurrentTestFn;

export type EachTestFn<EachCallback extends TestCallback> = (
  ...args: ReadonlyArray<any>
) => ReturnType<EachCallback>;

interface Each<EachFn extends TestFn | BlockFn> {
  <T extends Record<string, unknown>>(table: ReadonlyArray<T>): (
    name: string | NameLike,
    fn: (arg: T) => ReturnType<EachFn>,
    timeout?: number,
  ) => void;

  <T extends readonly [unknown, ...Array<unknown>]>(table: ReadonlyArray<T>): (
    name: string | NameLike,
    fn: (...args: T) => ReturnType<EachFn>,
    timeout?: number,
  ) => void;

  <T extends readonly [unknown, ...Array<unknown>]>(table: T): (
    name: string | NameLike,
    fn: (...args: T) => ReturnType<EachFn>,
    timeout?: number,
  ) => void;

  <T extends ReadonlyArray<unknown>>(table: ReadonlyArray<T>): (
    name: string | NameLike,
    fn: (...args: T) => ReturnType<EachFn>,
    timeout?: number,
  ) => void;

  <T extends ReadonlyArray<unknown>>(table: T): (
    name: string | NameLike,
    fn: (...args: T) => ReturnType<EachFn>,
    timeout?: number,
  ) => void;

  <T extends unknown>(
    strings: TemplateStringsArray,
    ...expressions: Array<T>
  ): (
    name: string | NameLike,
    fn: (arg: Record<string, T>) => ReturnType<EachFn>,
    timeout?: number,
  ) => void;

  <T extends Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...expressions: Array<unknown>
  ): (
    name: string | NameLike,
    fn: (arg: T) => ReturnType<EachFn>,
    timeout?: number,
  ) => void;
}

export interface HookBase {
  (fn: HookFn, timeout?: number): void;
}

export interface ItBase {
  (testName: TestNameLike, fn: TestFn, timeout?: number): void;
  each: Each<TestFn>;
  failing(testName: TestNameLike, fn: TestFn, timeout?: number): void;
}

export interface It extends ItBase {
  only: ItBase;
  skip: ItBase;
  todo: (testName: TestNameLike) => void;
}

export interface ItConcurrentBase {
  (testName: TestNameLike, testFn: ConcurrentTestFn, timeout?: number): void;
  each: Each<ConcurrentTestFn>;
  failing(testName: TestNameLike, fn: ConcurrentTestFn, timeout?: number): void;
}

export interface ItConcurrentExtended extends ItConcurrentBase {
  only: ItConcurrentBase;
  skip: ItConcurrentBase;
}

export interface ItConcurrent extends It {
  concurrent: ItConcurrentExtended;
}

export interface DescribeBase {
  (blockName: BlockNameLike, blockFn: BlockFn): void;
  each: Each<BlockFn>;
}

export interface Describe extends DescribeBase {
  only: DescribeBase;
  skip: DescribeBase;
}

export interface TestFrameworkGlobals {
  it: ItConcurrent;
  test: ItConcurrent;
  fit: ItBase & {concurrent?: ItConcurrentBase};
  xit: ItBase;
  xtest: ItBase;
  describe: Describe;
  xdescribe: DescribeBase;
  fdescribe: DescribeBase;
  beforeAll: HookBase;
  beforeEach: HookBase;
  afterEach: HookBase;
  afterAll: HookBase;
}

export interface GlobalAdditions extends TestFrameworkGlobals {
  __coverage__: CoverageMapData;
}

export interface Global
  extends GlobalAdditions,
    Omit<typeof globalThis, keyof GlobalAdditions> {
  [extras: PropertyKey]: unknown;
}
