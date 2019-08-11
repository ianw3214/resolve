#include "entityEditWidget.hpp"

#include "../../editor.hpp"
#include "../../archetypeManager.hpp"
#include "../../entity.hpp"

using json = nlohmann::json;

EntityEditWidget::EntityEditWidget(Editor * editor) 
    : editorRef(editor)
    , archetypeManager(editor->get_archetype_manager())
    , Widget("Entity Edit", Anchor::TOP_RIGHT) 
{
    set_update(true);
}

void EntityEditWidget::print_json_object(const nlohmann::json& data, int level) {
    for (auto it : data.items()) {
        const std::string& key = it.key();
        const json& value = it.value();

        static const int col_length = 20;
        int padding = get_text_width(TextSize::TINY) * (col_length - key.size() - level * 4);

        // TODO: Maybe not hard code these
        add_h_padding(get_text_width(TextSize::TINY) * (2 + level * 4));
        draw_text(key, TextSize::TINY, false);
        add_h_padding(padding);
        if (value.is_boolean()) {
            bool val = static_cast<bool>(value);
            if (val) draw_text("TRUE", TextSize::TINY);
            else draw_text("FALSE", TextSize::TINY);
        }
        if (value.is_number_integer()) {
            bool val = static_cast<int>(value);
            draw_text(std::to_string(val), TextSize::TINY);
        }
        if (value.is_number_float()) {
            bool val = static_cast<float>(value);
            draw_text(std::to_string(val), TextSize::TINY);
        }
        if (value.is_string()) {
            const std::string& val = static_cast<std::string>(value);
            if (val.size() > 0) {
                draw_text(static_cast<std::string>(value), TextSize::TINY);
            } else {
                new_line(TextSize::TINY);
            }
        }
        if (value.is_object()) {
            new_line(TextSize::TINY);
            print_json_object(value, level + 1);
        }
        if (value.is_array()) {
            // TODO: Implement
            new_line(TextSize::TINY);
            add_h_padding(2 + 4 + level * 4);
            draw_text("Array info not yet implemented", TextSize::TINY);
        }
    }
}

void EntityEditWidget::define() {
    if (editorRef->getState() == Editor::EditState::ENTITY) {
        set_show(true);
        // Draw common stuff
        draw_text("New Entity", [&]() {
            editorRef->trigger_add_new_entity();
        });
        // Draw the entity info if it exists
        Entity * entity = editorRef->get_selected_entity();
        if (entity) {
            if (entity->get_name().size() > 0) {
                draw_text(entity->get_name(), TextSize::SMALL);
            } else {
                draw_text("- no name -", TextSize::SMALL);
            }
            add_v_padding(20);
            // Show detailed attributes of the entity
            const std::string& archetype = entity->get_archetype();
            // TODO: Need to replace any overriden data here from the entity
            const json& data = archetypeManager.get_data(archetype);
            if (data.size() > 0) {
                draw_text(std::string("ARCHETYPE: ") + archetype, TextSize::SMALL);
                print_json_object(data);
            } else {
                draw_text(archetype + " is not a valid archetype...", TextSize::SMALL);
            }
        } else {
            draw_text("No entity selected...", TextSize::SMALL);
        }
    } else {
        set_show(false);
    }
}