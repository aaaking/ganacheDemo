/**
 * @author 周智慧
 * @email 1059084407@qq.com
 * @create date 2018-09-30 14:21:47
 * @modify date 2018-10-09 16:46:45
 * @desc [description]
*/
#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <string>

namespace DesertOasis {
    using namespace eosio;
    using std::string;

    class Player : public contract {
        using contract::contract;

        public:
            Player(account_name self): contract(self){};

            //@abi action
            [[eosio::action]]
            void add(account_name account, string& user_name);

            //@abi action
            [[eosio::action]]
            void update(account_name account, uint64_t level, int64_t health_points, int64_t energy_points);

            //@abi action
            [[eosio::action]]
            void getplayer(const account_name account);

            // @abi action
            [[eosio::action]]
            void hi(account_name account);

            //@abi action
            [[eosio::action]]
            void addability(const account_name account, string& ability);

            //@abi table item i64
            struct [[eosio::table]] item {
                uint64_t item_id;
                string name;
                uint64_t power;
                uint64_t health;
                string ability;
                uint64_t level_up;

                uint64_t primary_key() const { return item_id; }

                EOSLIB_SERIALIZE(item, (item_id)(name)(power)(health)(ability)(level_up))
            };

            //@abi action
            [[eosio::action]]
            void additem(const account_name account, item purchased_item);

            //@abi table playerv2 i64
            struct [[eosio::table]] playerv2 {
                uint64_t account_name;
                string user_name;
                uint64_t level;
                int64_t health_points = 1000;
                int64_t energy_points = 1000;
                std::vector<string> abilities;
                std::vector<item> inventory;

                uint64_t primary_key() const { return account_name; }

                EOSLIB_SERIALIZE(playerv2, (account_name)(user_name)(level)(health_points)(energy_points)(abilities)(inventory))
            };
            // typedef eosio::multi_index<(N(table_name), object_template_to_use> multi_index_name;
            typedef eosio::multi_index<N(playerv2), playerv2> playerIndex;
            // typedef eosio::multi_index<N(tries), tries_info, indexed_by<N(desc), const_mem_fun<tries_info, uint64_t, &tries_info::get_descOrder>>> tries;
    };
    EOSIO_ABI(Player, (add)(update)(getplayer)(hi)(addability)(additem));
}