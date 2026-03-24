import assert from 'node:assert';
// Note: In Node.js with --experimental-strip-types, .ts extensions can be used in imports.
import { statement as originalStatement } from './original.ts';
import { statement as refactoredStatement } from './refactored.ts';

const movies = {
  "F001": { "title": "Ran", "code": "regular" },
  "F002": { "title": "Trois Couleurs: Bleu", "code": "regular" },
  "F003": { "title": "Sunes Sommar", "code": "childrens" },
  "F004": { "title": "Yara", "code": "new" },
};

const testCases = [
  {
    name: "Standard customer",
    customer: {
      "name": "martin",
      "rentals": [
        { "movieID": "F001", "days": 3 },
        { "movieID": "F004", "days": 1 },
      ]
    }
  },
  {
    name: "New release bonus (3 days)",
    customer: {
      "name": "bonus_user",
      "rentals": [
        { "movieID": "F004", "days": 3 },
      ]
    }
  },
  {
    name: "Children's long term (5 days)",
    customer: {
      "name": "children_user",
      "rentals": [
        { "movieID": "F003", "days": 5 },
      ]
    }
  },
  {
    name: "Regular long term (5 days)",
    customer: {
      "name": "regular_user",
      "rentals": [
        { "movieID": "F001", "days": 5 },
      ]
    }
  },
  {
    name: "Empty rentals",
    customer: {
      "name": "empty_user",
      "rentals": []
    }
  }
];

console.log("Starting Parity Tests...\n");

testCases.forEach(tc => {
  process.stdout.write(`Testing: ${tc.name}... `);

  const originalResult = originalStatement(tc.customer, movies);
  const refactoredResult = refactoredStatement(tc.customer, movies);

  try {
    assert.strictEqual(originalResult, refactoredResult, `Output mismatch for ${tc.name}`);
    console.log("PASSED");
  } catch (err) {
    console.log("FAILED");
    console.error(err.message);
    process.exit(1);
  }
});

console.log("\n✨ All parity tests passed successfully!");
