#pragma once

#include <string>
#include "nlohmann/json.hpp"

#include <map>
#include <vector>
#include <string>

class ArchetypeManager {

public:
    ArchetypeManager();
    ~ArchetypeManager();

    void init();

    nlohmann::json get_data(std::string archetype) const;
    std::vector<std::string> get_archetypes();

private:
    // Name of archetype -> raw archetype JSON data
    std::map<std::string, nlohmann::json> m_archetypes;
};