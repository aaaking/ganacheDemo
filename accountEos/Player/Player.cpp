#include "Player.hpp"
// 木香花、太阳花、牡丹吊兰、四季海棠
// https://infinitexlabs.com/blog/
namespace DesertOasis {
    void Player::add(account_name account, string& user_name) {
        print("start execute add----");
        /**
         * We require that only the owner of an account can use this action
         * or somebody with the account authorization
        */
        require_auth(account);
        /**
         * We access the "playerv2" table as creating an object of type "playerIndex"
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
         * We add the new playerv2 in the table
         * The first argument is the payer of the storage which will store the data
        */
        players.emplace(account, [&](auto& playerv2) {
            playerv2.account_name = account;
            playerv2.level = 1;
            playerv2.user_name = user_name;
            playerv2.health_points = 1000;
            playerv2.energy_points = 1000;
        });
    }

    void Player::update(account_name account, uint64_t level, int64_t health_points, int64_t energy_points) {
        print("start execute update----");
        require_auth(account);
        playerIndex players(_self, _self);
        auto iterator = players.find(account);
        eosio_assert(iterator != players.end(), "Player for account not found--function--update");
        players.modify(iterator, account, [&](auto& playerv2) {
            playerv2.level = level;
            if (playerv2.health_points - health_points <= 0) {
                playerv2.health_points = 0;
            } else {
                playerv2.health_points -= health_points;
            }
            if (playerv2.energy_points - energy_points <= 0) {
                playerv2.energy_points = 0;
            } else {
                playerv2.energy_points -= energy_points;
            }
        });
    }

    void Player::addability(const account_name account, string& ability) {
        require_auth(account);
        playerIndex players(_self, _self);
        auto iterator = players.find(account);
        eosio_assert(iterator != players.end(), "Player for account not find, make sure it exists-----");
        players.modify(iterator, account, [&](auto& playerv2){
            playerv2.abilities.push_back(ability);
        });
    }

    void Player::getplayer(const account_name account) {
        print("start execute getplayer----");
        playerIndex players(_self, _self);
        auto iterator = players.find(account);
        eosio_assert(iterator != players.end(), "Player for account not found--function--getplayer");
        auto curPlayer = players.get(account);
        print("username: ", curPlayer.user_name.c_str(), "---");
        print("Level: ", curPlayer.level, "---");
        print("Health: ", curPlayer.health_points, "---");
        print("Energy: ", curPlayer.energy_points, "---");
        if (curPlayer.abilities.size() > 0) {
            print("All abilities: ");
            for (uint32_t i = 0; i < curPlayer.abilities.size(); i++) {
                print(curPlayer.abilities.at(i).c_str(), "---");
            }
        } else {
            print("No abilities-------");
        }
        if (curPlayer.inventory.size() > 0) {
            print(" Items: ");
            for (uint32_t i = 0; i < curPlayer.inventory.size(); i++) {
                item currentItem = curPlayer.inventory.at(i);
                print(currentItem.item_id, " == ", currentItem.name.c_str(), " == ", currentItem.ability.c_str(), " == ");
            }
        } else {
            print(" Empty inventory");
        }
    }

    void Player::hi(account_name account) {
        print("Hello, ", name{account});
    }

    void Player::additem(const account_name account, item purchased_item) {
        playerIndex players(_self, _self);
        auto iterator = players.find(account);
        eosio_assert(iterator != players.end(), "player for this account does not exists-----");
        players.modify(iterator, account, [&](auto& player){
            player.health_points += purchased_item.health;
            player.energy_points += purchased_item.power;
            player.level += purchased_item.level_up;
            player.abilities.push_back(purchased_item.ability);
            player.inventory.push_back(item{
                purchased_item.item_id,
                purchased_item.name,
                purchased_item.power,
                purchased_item.health,
                purchased_item.ability,
                purchased_item.level_up
            });
        });
        print("Item Id: ", purchased_item.item_id);
        print(" | Name: ", purchased_item.name.c_str());
        print(" | Power: ", purchased_item.power); 
        print(" | Health: ", purchased_item.health);
        print(" | Ability: ", purchased_item.ability.c_str());
        print(" | Level up: ", purchased_item.level_up);
    }
}