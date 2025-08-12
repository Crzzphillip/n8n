## src2/evaluation.ee/test-runner/__tests__/mock-data/execution-data.multiple-triggers-2.json

Overview: src2/evaluation.ee/test-runner/__tests__/mock-data/execution-data.multiple-triggers-2.json is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/evaluation.ee/test-runner/__tests__/mock-data/execution-data.multiple-triggers-2.json` and use the following source:

```json
{
	"startData": {},
	"resultData": {
		"runData": {
			"When chat message received": [
				{
					"startTime": 1732882447976,
					"executionTime": 0,
					"executionStatus": "success",
					"data": {
						"main": [
							[
								{
									"json": {
										"sessionId": "192c5b3c0b0642d68eab1a747a59cb6e",
										"action": "sendMessage",
										"chatInput": "hey"
									}
								}
							]
						]
					},
					"source": [null]
				}
			],
			"NoOp": [
				{
					"hints": [],
					"startTime": 1732882448034,
					"executionTime": 0,
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
									"json": {
										"sessionId": "192c5b3c0b0642d68eab1a747a59cb6e",
										"action": "sendMessage",
										"chatInput": "hey"
									},
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
					"startTime": 1732882448037,
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
									"json": {
										"sessionId": "192c5b3c0b0642d68eab1a747a59cb6e",
										"action": "sendMessage",
										"chatInput": "hey"
									},
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
