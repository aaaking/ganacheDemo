#include "Marketplace.hpp"
#include <eosiolib/asset.hpp>

namespace OasisMarket {
    void Marketplace::buy(account_name buyer, uint64_t productId) {
        productIndex products(_self, _self);
        auto iterator = products.find(productId);
        eosio_assert(iterator != products.end(), "the product does not found for buy---");

        auto product = products.get(productId);
        eosio_assert(product.quantity > 0, "this product is out of stock for buy---");

        // Create asset
        // asset({amount}, string_to_symbol({precision}, {symbol}));
        asset productPrice = asset(product.price, string_to_symbol(4, "OAS"));

        // Do inline trasfer
        // action(permission_level{ from, N(active) },, {contract_deployer}, {contract_action}, {data_to_pass}).send();
        action(vector<permission_level>(2, {buyer, N(active)}), N(aaaking35513), N(transfer), make_tuple(buyer, _self, productPrice, string(""))).send();

        // Execute action from another contract
        action(vector<permission_level>(2, {buyer, N(active)}), N(aaaking35512), N(additem), make_tuple(buyer, 
            product.product_id,
            product.name,
            product.power,
            product.health,
            product.ability,
            product.level_up
        )).send();

        update(buyer, product.product_id, -1);

    }

    void Marketplace::getbyid(uint64_t productId) {
        productIndex products(_self, _self);
        auto iterator = products.find(productId);
        eosio_assert(iterator != products.end(), "this products not found for getbyid----");
        auto product = products.get(productId);
        print("Id: ", product.product_id);
        print(" | Name: ", product.name.c_str());
        print(" | Power: ", product.power);
        print(" | Health: ", product.health);
        print(" | Ability: ", product.ability.c_str());
        print(" | Level up: ", product.level_up);
        print(" | Quantity: ", product.quantity); 
        print(" | Price: ", product.price);
    }

    void Marketplace::add(account_name account, product newProduct) {
        require_auth(account);

        productIndex products(_self, _self);
        auto iterator = products.find(newProduct.product_id);
        eosio_assert(iterator == products.end(), "Product for this ID already exists");
        products.emplace(account, [&](auto& product) {
            product.product_id = newProduct.product_id;
            product.name = newProduct.name;
            product.power = newProduct.power;
            product.health = newProduct.health;
            product.ability = newProduct.ability;
            product.level_up = newProduct.level_up;
            product.quantity = newProduct.quantity;
            product.price = newProduct.price;
        });
    }

    void Marketplace::update(account_name account, uint64_t product_id, uint64_t quantity) {
        require_auth(account);

        productIndex products(_self, _self);
        auto iterator = products.find(product_id);
        eosio_assert(iterator != products.end(), "Product not found--");
        products.modify(iterator, account, [&](auto& product){
            product.quantity += quantity;
        });
    }

    void Marketplace::remove(account_name account, uint64_t product_id) {
        require_auth(account);
        productIndex products(_self, _self);
        auto iterator = products.find(product_id);
        eosio_assert(iterator != products.end(), "no such product");
        products.erase(iterator);
    }
}