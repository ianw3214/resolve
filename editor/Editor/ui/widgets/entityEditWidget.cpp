#include "entityEditWidget.hpp"

#include "../../editor.hpp"
#include "../../entity.hpp"

EntityEditWidget::EntityEditWidget(Editor * editor) 
    : editorRef(editor), Widget("Entity Edit") 
{
    set_update(true);
}

void EntityEditWidget::define() {
    if (editorRef->getState() == Editor::EditState::ENTITY) {
        set_show(true);
        // Draw the entity info
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