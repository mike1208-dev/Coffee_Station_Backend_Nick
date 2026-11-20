# Database Design

## Product
| Field | Type | Required |
|---|---|---|
| id | String (cuid) | yes |
| name | String | yes |
| category | Enum: Coffee, Tea, Desserts, Breakfast, Combos | yes |
| description | String | yes |
| price | Decimal | yes |
| imageUrl | String | yes |
| rating | Float | yes |

## Order
| Field | Type | Required |
|---|---|---|
| id | String (cuid) | yes |
| status | Enum: Pending, Confirmed, Completed, Cancelled | yes |
| totalPrice | Decimal | yes |
| createdAt | DateTime | yes |

## OrderItem
| Field | Type | Required |
|---|---|---|
| id | String (cuid) | yes |
| orderId | String (FK → Order) | yes |
| productId | String (FK → Product) | yes |
| productName | String (snapshot) | yes |
| unitPrice | Decimal (snapshot) | yes |
| quantity | Int | yes |

**Relation:** an Order has many OrderItems; each OrderItem belongs to one Product.

**Snapshot decision:** OrderItem copies `productName` and `unitPrice` at order time rather than only referencing Product. Why: if a product's price or name changes later, past orders must still show what the customer actually paid — not today's price.

## Booking
| Field | Type | Required |
|---|---|---|
| id | String (cuid) | yes |
| name | String | yes |
| date | DateTime (date part) | yes |
| time | Enum: "09:00", "13:00", "18:00" | yes |
| guestCount | Int | yes |

**Booking rules:**
- Capacity: the cafe can serve 40 people at once. A new booking is accepted only if `(sum of guestCount for all existing bookings at that date+time) + (new booking's guestCount) <= 40`. If it would exceed 40, reject the booking.
- Two bookings CAN share the same date+time slot, as long as the 40-person total isn't exceeded.

## Money storage
`Decimal` (Prisma's `Decimal` type), for both Product.price and Order/OrderItem amounts. Why: issue #8 already requires `Decimal` for Product, so using the same type everywhere avoids rounding mismatches between a product's price and an order's stored total — floats lose precision for money, and switching types mid-pipeline (Decimal here, cents-as-int there) adds conversion bugs for no benefit.
