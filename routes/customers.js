const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.route("/")
      .get(auth, async (req, res) => {
  const customers = await Customer.find()
    .select("-__v")
    .sort("name");
  res.send(customers);
})
      .post(auth, async (req, res) => {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let customer = new Customer({
          name: req.body.name,
          isGold: req.body.isGold,
          phone: req.body.phone
        });
        customer = await customer.save();

        res.send(customer);
      });

router.route("/:id")
      .get(auth, async (req, res) => {
  const customer = await Customer.findById(req.params.id).select("-__v");

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
})
      .delete(auth, async (req, res) => {
        const customer = await Customer.findByIdAndRemove(req.params.id);

        if (!customer)
          return res
              .status(404)
              .send("The customer with the given ID was not found.");

        res.send(customer);
      })
      .put(auth, async (req, res) => {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
              name: req.body.name,
              isGold: req.body.isGold,
              phone: req.body.phone
            },
            { new: true }
        );

        if (!customer)
          return res
              .status(404)
              .send("The customer with the given ID was not found.");

        res.send(customer);
      });

module.exports = router;
