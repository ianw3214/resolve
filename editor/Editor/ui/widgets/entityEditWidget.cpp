#include "entityEditWidget.hpp"

#include "../../editor.hpp"
#include "../../entity.hpp"

EntityEditWidget::EntityEditWidget(Editor * editor) 
    : editorRef(editor), Widget("Entity Edit", Anchor::TOP_RIGHT) 
{
    set_update(true);
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
            draw_text(entity->get_name(), TextSize::SMALL);
        } else {
            draw_text("No entity selected...", TextSize::SMALL);
        }
    } else {
        set_show(false);
    }
}