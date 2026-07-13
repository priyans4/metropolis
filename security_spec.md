# Security Specification: The Metropolis Hotel Booking System

This specification outlines the data invariants, threat model, and "Dirty Dozen" attack payloads for the Firestore Security Rules.

## 1. Data Invariants

1. **User Profiles (`/users/{userId}`)**:
   - A profile can only be created or modified by its owner (`request.auth.uid == userId`).
   - Profile reads are strictly private to the owner. No blanket reads.
   - The user cannot elevate their privilege or alter administrative/system fields.

2. **Bookings (`/bookings/{bookingId}`)**:
   - Bookings can only be created by authenticated users, with the `userId` in the payload strictly matching `request.auth.uid`.
   - A user can only read, update, or cancel their own bookings.
   - Once a booking is created, core fields like `id`, `userId`, `suiteId`, and `totalPrice` are immutable.
   - Status transitions are restricted (only `'active' -> 'cancelled'` is allowed).
   - If a booking status is `'cancelled'`, it is terminal; no further edits are permitted.

3. **Reviews (`/reviews/{reviewId}`)**:
   - Reviews can be read by anyone (publicly).
   - Reviews can only be created/written by authenticated users whose `request.auth.uid` matches the `userId` in the payload.
   - A review cannot be edited after creation except by the author or an administrator.

4. **Suites (`/suites/{suiteId}`)**:
   - Suite records are publicly readable.
   - Writing/modifying suite documents is completely forbidden to normal users (reserved for system/admin, or read-only).

---

## 2. The "Dirty Dozen" Attack Payloads

The following payloads represent unauthorized or malicious states that our Firestore rules must prevent:

### Attack 1: User Profile Spoofing
An authenticated user `attacker123` attempts to write a user profile for a different user `victim456`.
- **Target Path**: `/users/victim456`
- **Expected Outcome**: `PERMISSION_DENIED`

### Attack 2: Booking Identity Hijack
An authenticated user `attacker123` attempts to create a booking where the `userId` is set to `victim456`.
- **Target Path**: `/bookings/b_malicious_1`
- **Expected Outcome**: `PERMISSION_DENIED`

### Attack 3: Unauthorized Booking Inspection
An authenticated user `attacker123` attempts to read a booking document belonging to `victim456`.
- **Target Path**: `/bookings/booking_victim_99`
- **Expected Outcome**: `PERMISSION_DENIED`

### Attack 4: Booking Sabotage (Cancel Someone Else's Booking)
An authenticated user `attacker123` attempts to update/cancel a booking owned by `victim456`.
- **Target Path**: `/bookings/booking_victim_99`
- **Expected Outcome**: `PERMISSION_DENIED`

### Attack 5: Unsigned Guest Write
An unauthenticated (anonymous or guest) client attempts to create a booking.
- **Target Path**: `/bookings/b_guest_1`
- **Expected Outcome**: `PERMISSION_DENIED`

### Attack 6: Bypass Validation with Shadow Fields (Shadow Injection)
An authenticated user attempts to write a booking with extra unapproved fields like `isAdmin: true` or `discountCode: "FREE_STAYS"`.
- **Target Path**: `/bookings/b_attacker_1`
- **Expected Outcome**: `PERMISSION_DENIED`

### Attack 7: Immutable Field Tampering
An authenticated user attempts to modify the `suiteId` or `totalPrice` of an existing active booking.
- **Target Path**: `/bookings/b_attacker_1` (Update request changing `totalPrice` from `1000` to `10`)
- **Expected Outcome**: `PERMISSION_DENIED`

### Attack 8: Terminal State Violation
An authenticated user attempts to change the status of an already `'cancelled'` booking back to `'active'`.
- **Target Path**: `/bookings/b_cancelled_1`
- **Expected Outcome**: `PERMISSION_DENIED`

### Attack 9: Temporal Integrity Fraud
An authenticated user attempts to submit a booking with a future `bookingDate` or custom timestamp instead of the server timestamp.
- **Target Path**: `/bookings/b_attacker_2` (where `bookingDate` is set to a client-controlled value)
- **Expected Outcome**: `PERMISSION_DENIED`

### Attack 10: Suite Price Poisoning
An authenticated user attempts to modify a suite's rate per night to `$1.00`.
- **Target Path**: `/suites/standard_room`
- **Expected Outcome**: `PERMISSION_DENIED`

### Attack 11: Review Identity Impersonation
An authenticated user `attacker123` attempts to create a review using the name/id of `victim456`.
- **Target Path**: `/reviews/rev_1` (with `userId: "victim456"`)
- **Expected Outcome**: `PERMISSION_DENIED`

### Attack 12: Blanket Data Harvesting (Query Scraping)
An authenticated user tries to list all bookings in the system without specifying their own `userId` in the query constraints.
- **Target Path**: `/bookings` (Listing/list query)
- **Expected Outcome**: `PERMISSION_DENIED`

---

## 3. Test Runner Schema (`firestore.rules.test.ts`)

Below is the verification test file designed to validate these threat vectors using the `@firebase/rules-unit-testing` harness.

```ts
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

describe('The Metropolis Firestore Security Rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'metropolishotelbooking',
      firestore: {
        rules: require('fs').readFileSync('firestore.rules', 'utf8'),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it('Blocks profile spoofing (Attack 1)', async () => {
    const attackerContext = testEnv.authenticatedContext('attacker123');
    const db = attackerContext.firestore();
    await assertFails(
      setDoc(doc(db, 'users', 'victim456'), {
        fullName: 'Victim Name',
        email: 'victim@luminaelite.com',
        phone: '1234567890',
      })
    );
  });

  it('Blocks booking identity hijack (Attack 2)', async () => {
    const attackerContext = testEnv.authenticatedContext('attacker123');
    const db = attackerContext.firestore();
    await assertFails(
      setDoc(doc(db, 'bookings', 'b_malicious_1'), {
        id: 'b_malicious_1',
        userId: 'victim456',
        suiteId: 'suite_1',
        suiteName: 'Penthouse',
        checkIn: '2026-08-01',
        checkOut: '2026-08-05',
        guests: 2,
        guestName: 'Attacker',
        guestEmail: 'attacker@mail.com',
        guestPhone: '123',
        totalPrice: 4000,
        nights: 4,
        status: 'active',
        bookingDate: new Date().toISOString(),
      })
    );
  });

  it('Blocks unauthorized booking read (Attack 3)', async () => {
    const attackerContext = testEnv.authenticatedContext('attacker123');
    const db = attackerContext.firestore();
    await assertFails(getDoc(doc(db, 'bookings', 'booking_victim_99')));
  });
});
```
