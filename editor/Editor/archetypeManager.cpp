#include "archetypeManager.hpp"

#define FOLDER "../res/archetypes/"
#include <filesystem>
#include <fstream>

using json = nlohmann::json;
namespace fs = std::filesystem;

ArchetypeManager::ArchetypeManager() {

}

ArchetypeManager::~ArchetypeManager() {

}

nlohmann::json ArchetypeManager::get_data(std::string archetype) const {
    auto it = m_archetypes.find(archetype);
    if (it != m_archetypes.end()) {
        return it->second;
    }
    return json();
}

void ArchetypeManager::init() {
    // Load the archetypesss
    for (const auto & it : fs::directory_iterator(FOLDER)) {
        fs::path path = it.path();
        std::string name = path.stem().string();

        // Ignore the file if it is not a JSON file
        if (path.extension() != ".JSON") continue;

        // Just deserialize the whole raw JSON
        std::ifstream file(path);
        if (file) {
            m_archetypes[name] = json();
            file >> m_archetypes[name];
        }
    }
}