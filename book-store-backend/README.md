http://localhost:8000/api-docs/


🧠 HIGH-LEVEL PRODUCT FLOW (IMPORTANT)
Roles

ADMIN

Create products (books for sale)

Update products

Delete products

USER

View available products

Add products to cart

Like products (wishlist)

Create orders from cart

🏗️ STEP-BY-STEP IMPLEMENTATION PLAN

We will build this in 6 logical steps (do not skip):

✅ STEP 1: Define Product Scope (Book as a Product)

We will reuse Book but extend it for selling.

Product rules

A book can:

Be borrowed (library)

Be sold (product)

A book can have:

price

isForSale

stock (separate from borrow quantity)