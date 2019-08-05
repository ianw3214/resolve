#pragma once
#include "core/engine.hpp"

#include "archetypeManager.hpp"
#include "logger.hpp"
#include "ui/widgets/widgetManager.hpp"

#include "entity.hpp"

constexpr int base_tile_size = 64;

// TODO: Somehow input file paths or something

class Editor : public State {

    ArchetypeManager archetypeManager;
    Logger logger;
    WidgetManager widgetManager;

public:

    enum class EditState {
        TILE,
        COLLISION,
        ENTITY
    };
    void changeState(EditState new_state) { m_edit_state = new_state; }
    EditState getState() const { return m_edit_state; }

    Editor();
    ~Editor();

    void init() override;
    void cleanup() override;
    void pause() override;
    void resume() override;
    void update() override;
    void render() override;

    void save_map();

    void set_brush_tile(int tile);
    void swap_tile(int x, int y, int tile_index);
    void toggle_collision(int x, int y);

    int get_map_width() const { return m_map_width; }
    int get_map_height() const { return m_map_height; }

    void increase_map_width();
    void increase_map_height();
    void decrease_map_width();
    void decrease_map_height();

    void select_entity(int mouse_x, int mouse_y);
    Entity * get_selected_entity() const { return m_selected_entity; }

private:
    /// --------------------------
    /// MAP METADATA
    /// --------------------------
    std::string m_tilesheet_src;
    int m_tile_size;
    int m_tilesheet_width;
    int m_tilesheet_height;

    int m_map_width;
    int m_map_height;

    std::vector<int> m_tilemap;
    std::vector<int> m_collision_map;

    std::vector<Entity> m_entities;

    /// --------------------------
    /// Editor state
    /// --------------------------
    float m_tile_scale;
    int m_camera_x;
    int m_camera_y;
    int m_mouse_tile_x;
    int m_mouse_tile_y;

    int m_brush_tile;

    EditState m_edit_state;

    Entity * m_selected_entity;

    // Panning data
    bool m_panning;
    int m_pan_start_mouse_x;
    int m_pan_start_mouse_y;
    int m_pan_start_camera_x;
    int m_pan_start_camera_y;

};