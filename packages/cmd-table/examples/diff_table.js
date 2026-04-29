"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var oldConfig = [
    { service: 'api', version: '1.2.0', status: 'running', memory_mb: 512 },
    { service: 'database', version: '14.0', status: 'running', memory_mb: 2048 },
    { service: 'cache', version: '6.2.0', status: 'stopped', memory_mb: 128 },
    { service: 'worker-1', version: '1.0.0', status: 'running', memory_mb: 256 },
    { service: 'proxy', version: '2.1.0', status: 'running', memory_mb: 64 }, // Unchanged
];
var newConfig = [
    { service: 'api', version: '1.3.0', status: 'running', memory_mb: 512 }, // Modified version
    { service: 'database', version: '14.0', status: 'running', memory_mb: 4096 }, // Modified memory
    { service: 'cache', version: '6.2.0', status: 'running', memory_mb: 256 }, // Modified status & memory
    { service: 'worker-2', version: '1.0.0', status: 'running', memory_mb: 256 }, // Added
    { service: 'proxy', version: '2.1.0', status: 'running', memory_mb: 64 }, // Unchanged
]; // worker-1 removed
console.log('--- Configuration Diff ---');
var diffTable = src_1.Table.compare(oldConfig, newConfig, {
    primaryKey: 'service',
    showUnchanged: false
});
console.log(diffTable.render());
console.log('\n--- Configuration Diff (Including Unchanged) ---');
var fullDiffTable = src_1.Table.compare(oldConfig, newConfig, {
    primaryKey: 'service',
    showUnchanged: true
});
console.log(fullDiffTable.render());
