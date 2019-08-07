#include "entity.hpp"
#include "archetypeManager.hpp"

using json = nlohmann::json;

#include <fstream>

Entity::Entity(ArchetypeManager * archetypeManager) 
    : m_data()
    , archetypeManager(archetypeManager)
    , m_has_texture(false)
    , m_texture(nullptr)
    , m_x(0)
    , m_y(0)
{
    m_data.clear();
    m_data["name"] = "INVALID";
    m_data["archetype"] = "INVALID";
}

Entity::Entity(ArchetypeManager * archetypeManager, const std::string& name, const std::string& archetype) 
    : m_data()
    , archetypeManager(archetypeManager)
    , m_has_texture(false)
    , m_texture(nullptr)
    , m_x(0)
    , m_y(0)
{
    // Setup the data field
    m_data.clear();
    m_data["name"] = std::string(name);
    m_data["archetype"] = std::string(archetype);
    load_texture();
}

Entity::Entity(ArchetypeManager * archetypeManager, json data) 
    : m_data(data)
    , archetypeManager(archetypeManager)
    , m_has_texture(false) 
    , m_texture(nullptr)
    , m_x(0)
    , m_y(0)
{
    load_texture();
    // Change data based on overriden shit
    if (data.find("position") != data.end()) {
        m_x = data["position"]["x"];
        m_y = data["position"]["y"];
    }
}

Entity::Entity(Entity && rhs) noexcept {
    m_data = rhs.m_data;
    m_x = rhs.m_x;
    m_y = rhs.m_y;
    archetypeManager = rhs.archetypeManager;
    m_has_texture = rhs.m_has_texture;
    m_texture = rhs.m_texture;
    // Make sure the texture isn't deleted
    rhs.m_texture = nullptr;
    m_w = rhs.m_w;
    m_h = rhs.m_h;
    m_animated = rhs.m_animated;
    m_target_x = rhs.m_target_x;
    m_target_y = rhs.m_target_y;
    m_target_w = rhs.m_target_w;
    m_target_h = rhs.m_target_h;
}

Entity::~Entity() {
    delete m_texture;
}

void Entity::render(int camera_x, int camera_y, float scale, bool outline) {
    if (m_has_texture && m_texture != nullptr) {
        int x = static_cast<int>(m_x  * scale - camera_x);
        int y = static_cast<int>(m_y  * scale - camera_y);
        int w = static_cast<int>(m_w * scale);
        int h = static_cast<int>(m_h * scale);
        m_texture->render(x, y, w, h);
        // Render the outline if specified
        if (outline) {
            QcE::get_instance()->drawLine(x, y, x + w, y);
            QcE::get_instance()->drawLine(x, y, x, y + h);
            QcE::get_instance()->drawLine(x + w, y, x + w, y + h);
            QcE::get_instance()->drawLine(x + w, y + h, x, y + h);
        }
    }
}

std::string Entity::get_name() const {
    if (m_data.find("name") != m_data.end()) {
        return m_data["name"];
    }
    return std::string("INVALID");
}

std::string Entity::get_archetype() const {
    if (m_data.find("archetype") != m_data.end()) {
        return m_data["archetype"];
    }
    return std::string("INVALID");
}


json Entity::get_entity_json() const {
    return m_data;
}

void Entity::load_texture() {
    // Look for a texture and cache it
    json archetype = archetypeManager->get_data(m_data["archetype"]);
    if (archetype.find("position") != archetype.end()) {
        m_x = archetype["position"]["x"];
        m_y = archetype["position"]["y"];
    }
    if (archetype.find("render") != archetype.end()) {
        m_has_texture = true;
        std::string path = archetype["render"]["path"];
        // CREATE THE TEXTURE!
        m_texture = new Texture(std::string("../") + path);
        m_w = archetype["render"]["w"];
        m_h = archetype["render"]["h"];
        // Get correct info for animation if it exists
        if (archetype.find("animation") != archetype.end()) {
            std::string anim_data_path = archetype["animation"]["path"];
            // TODO: Figure out how to maybe not hard code this
            std::ifstream anim_data(std::string("../") + anim_data_path);
            if (anim_data.is_open()) {
                json anim_json;
                anim_data >> anim_json;

                m_animated = true;
                m_target_x = 0;
                m_target_y = 0;
                m_target_w = anim_json["frame_width"];
                m_target_h = anim_json["frame_height"];

                m_texture->setSource(m_target_x, m_target_y, m_target_w, m_target_h);
            } else {
                // TODO: Error logging
            }
        }
    }
}