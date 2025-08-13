## src2/evaluation.ee/test-runner/__tests__/mock-data/execution-data.multiple-triggers.json

Overview: src2/evaluation.ee/test-runner/__tests__/mock-data/execution-data.multiple-triggers.json is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/evaluation.ee/test-runner/__tests__/mock-data/execution-data.multiple-triggers.json` and use the following source:

```json
{
	"startData": {},
	"resultData": {
		"runData": {
			"When clicking ‘Execute workflow’": [
				{
					"hints": [],
					"startTime": 1732882424975,
					"executionTime": 0,
					"source": [],
					"executionStatus": "success",
					"data": {
						"main": [
							[
								{
									"json": {},
									"pairedItem": {
										"item": 0
									}
								}
							]
						]
					}
				}
			],
			"NoOp": [
				{
					"hints": [],
					"startTime": 1732882424977,
					"executionTime": 1,
					"source": [
						{
							"previousNode": "When clicking ‘Execute workflow’"
						}
					],
					"executionStatus": "success",
					"data": {
						"main": [
							[
								{
									"json": {},
									"pairedItem": {
										"item": 0
									}
								}
							]
						]
					}
				}
			],
			"NoOp2": [
				{
					"hints": [],
					"startTime": 1732882424978,
					"executionTime": 0,
					"source": [
						{
							"previousNode": "NoOp"
						}
					],
					"executionStatus": "success",
					"data": {
						"main": [
							[
								{
									"json": {},
									"pairedItem": {
										"item": 0
									}
								}
							]
						]
					}
				}
			]
		},
		"pinData": {},
		"lastNodeExecuted": "NoOp2"
	},
	"executionData": {
		"contextData": {},
		"nodeExecutionStack": [],
		"metadata": {},
		"waitingExecution": {},
		"waitingExecutionSource": {}
	}
}

```
