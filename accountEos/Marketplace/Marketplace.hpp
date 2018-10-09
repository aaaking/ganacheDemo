#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <string>

namespace OasisMarket {
    using namespace eosio;
    using std::string;
    class Marketplace : public contract {
        using contract::contract;
        public:
            Marketplace(account_name account): contract(account){}

            //@abi action
            [[eosio::action]]
            void buy(account_name buyer, uint64_t productId);

            //@abi action
            [[eosio::action]]
            void getbyid(uint64_t productId);

            //@abi table product i64
            struct [[eosio::table]] product {
                uint64_t product_id;
                string name;
                uint64_t power;
                uint64_t health;
                string ability;
                uint64_t level_up;
                uint64_t quantity;
                uint64_t price;

                uint64_t primary_key() const { return product_id; }

                EOSLIB_SERIALIZE(product, (product_id)(name)(power)(health)(ability)(level_up)(quantity)(price))
            };
            typedef multi_index<N(product), product> productIndex;

            //@abi action
            [[eosio::action]]
            void add(account_name account, product newProduct);

            //@abi action
            [[eosio::action]]
            void update(account_name account, uint64_t product_id, uint64_t quantity);

            //@abi action
            [[eosio::action]]
            void remove(account_name account, uint64_t productId);
    };
    EOSIO_ABI(Marketplace, (buy)(getbyid)(add)(update)(remove));
}