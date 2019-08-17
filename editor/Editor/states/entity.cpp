#include "../editor.hpp"

#include "../ui/widgets/newEntityWidget.hpp"

void Editor::update_entity_state() {
    // The initial setting of entity position
    if (m_setting_pos) {
        m_selected_entity->set_pos(getMouseX(), getMouseY());
    } else {
        // Moving entities?
        if (leftMouseHeld()) {
            if (m_selected_entity != nullptr && m_moving_entity) {
                m_selected_entity->set_pos(
                    static_cast<int>((getMouseX() + m_camera_x) / m_scale) - m_entity_move_offset_x,
                    static_cast<int>((getMouseY() + m_camera_y) / m_scale) - m_entity_move_offset_y
                );
            }
        } else {
            // TODO: This flag might have to be reset upon switching into entity mode too
            m_moving_entity = false;
        }
        // Trigger adding a new entity (SHORTCUT)
        if (keyDown(SDL_SCANCODE_N)) {
            trigger_add_new_entity();
        }
        // Delete entity?
        if (keyDown(SDL_SCANCODE_DELETE)) {
            delete_selected_entity();
        }
    }
}

void Editor::select_entity(int mouse_x, int mouse_y) {
    mouse_x += m_camera_x;
    mouse_y += m_camera_y;
    for (Entity& entity : m_entities) {
        int x = static_cast<int>(entity.get_x() * m_scale);
        int y = static_cast<int>(entity.get_y() * m_scale);
        int w = static_cast<int>(entity.get_w() * m_scale);
        int h = static_cast<int>(entity.get_h() * m_scale);
        if (mouse_x > x && mouse_x < x + w && mouse_y > y && mouse_y < y + h) {
            if (m_selected_entity != &entity) {
                m_moving_entity = false;
                m_selected_entity = &entity;
            } else {
                // If the same entity is selected, start moving it
                m_moving_entity = true;
            }
            m_entity_move_offset_x = mouse_x - x;
            m_entity_move_offset_y = mouse_y - y;
            return;
        }
    }
    // If nothing was selected, deselect entity
    m_selected_entity = nullptr;
}

void Editor::trigger_add_new_entity() {
    Widget * widget = widgetManager.get_widget(NewEntityWidget::widgetName);
    widget->set_show(true);
}

void Editor::add_new_entity(const std::string& name, const std::string& archetype) {
    m_selected_entity = &(m_entities.emplace_back(&archetypeManager, name, archetype));
    // Set the current entity to the new entity
    m_setting_pos = true;
}

void Editor::delete_selected_entity() {
    if (!m_selected_entity) return;
    for (auto it = m_entities.begin(); it != m_entities.end(); ++it) {
        if (&(*it) == m_selected_entity) {
            m_entities.erase(it);
            break;
        }
    }
    m_selected_entity = nullptr;
}