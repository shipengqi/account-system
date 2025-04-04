/**
 * Copyright 2017 - 2025 Open Text.
 *
 * The only warranties for products and services of Open Text and its affiliates and licensors ("Open Text")
 * are as may be set forth in the express warranty statements accompanying such products and services.
 * Nothing herein should be construed as constituting an additional warranty. Open Text shall not be liable
 * for technical or editorial errors or omissions contained herein. The information contained herein is subject
 * to change without notice.
 *
 * Except as specifically indicated otherwise, this document contains confidential information and a valid
 * license is required for possession, use or copying. If this work is provided to the U.S. Government,
 * consistent with FAR 12.211 and 12.212, Commercial Computer Software, Computer Software
 * Documentation, and Technical Data for Commercial Items are licensed to the U.S. Government under
 * vendor's standard commercial license.
 */
import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';

import {STORE_DEFAULT_CONFIG, STORE_CONFIG_TOKEN, StoreConfig} from './store.config';
import {StoreService} from './store.service';

export const provideStoreService = (config: StoreConfig = STORE_DEFAULT_CONFIG): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {provide: STORE_CONFIG_TOKEN, useValue: config},
    StoreService
  ]);
};

export * from './interface';
export * from './store.types';
export * from './store.config';
