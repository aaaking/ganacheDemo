#include "Players.hpp"
// 木香花、太阳花、牡丹吊兰、四季海棠
// https://infinitexlabs.com/blog/
namespace Oasis {
    using namespace eosio;
    using std::string;

    class Players : public contract {
        using contract::contract;
        public:

            Players(account_name self) : contract(self){}

            //@abi action
            [[eosio::action]]
            void add(account_name account, string& user_name) {
                print("start execute add");
                /**
                 * We require that only the owner of an account can use this action
                 * or somebody with the account authorization
                */
                require_auth(account);
                /**
                 * We access the "player" table as creating an object of type "playerIndex"
                 * As parameters we pass code & scope - _self from the parent contract
                */
                playerIndex players(_self, _self);
                /**
                 * We must verify that the account doesn't exist yet
                 * If the account is not found the iterator variable should be players.end()
                */
                auto iterator = players.find(account);
                eosio_assert(iterator == players.end(), "Player for account already exists--function--add");
                /**
                 * We add the new player in the table
                 * The first argument is the payer of the storage which will store the data
                */
                players.emplace(account, [&](auto& player) {
                    player.account_name = account;
                    player.level = 1;
                    player.user_name = user_name;
                    player.health_points = 1000;
                    player.energy_points = 1000;
                });
            }

            //@abi action
            [[eosio::action]]
            void update(account_name account, uint64_t level, uint64_t health_points, uint64_t energy_points) {
                print("start execute update");
                require_auth(account);
                playerIndex players(_self, _self);
                auto iterator = players.find(account);
                eosio_assert(iterator != players.end(), "Player for account not found--function--update");
                players.modify(iterator, account, [&](auto& player) {
                    player.level = level;
                    if (player.health_points - health_points <= 0) {
                        player.health_points = 0;
                    } else {
                        player.health_points -= health_points;
                    }
                    if (player.energy_points - energy_points <= 0) {
                        player.energy_points = 0;
                    } else {
                        player.energy_points -= energy_points;
                    }
                });
            }

            //@abi action
            [[eosio::action]]
            void getplayer(const account_name account) {
                print("start execute getplayer");
                playerIndex players(_self, _self);
                auto iterator = players.find(account);
                eosio_assert(iterator != players.end(), "Player for account not found--function--getplayer");
                auto curPlayer = players.get(account);
                print("Username: ", curPlayer.user_name.c_str(), " Level: ", curPlayer.level, " Health: ", curPlayer.health_points, " Energy: ", curPlayer.energy_points);
            }

            [[eosio::action]]
            void hi(account_name account) {
                print("Hello, ", name{account});
            }

        private:
            //We also have an indication flag for the eosiocpp script – “//@abi table player i64“.
            //We are saying that the name of our table is player and the used index type is i64.
            //@abi table player i64
            struct [[eosio::table]] player {
                uint64_t account_name;
                string user_name;
                uint64_t level;
                uint64_t health_points = 1000;
                uint64_t energy_points = 1000;
                uint64_t primary_key() const { return account_name; }
                EOSLIB_SERIALIZE(player, (account_name)(user_name)(level)(health_points)(energy_points))
            };
            // typedef multi_index<N(table_name), object_template_to_use> multi_index_name;
            typedef eosio::multi_index<N(player), player> playerIndex;
    };
    EOSIO_ABI(Players, (add)(update)(getplayer)(hi))
}