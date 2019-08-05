#include "entityEditWidget.hpp"

#include "../../editor.hpp"

EntityEditWidget::EntityEditWidget(Editor * editor) 
    : editorRef(editor), Widget("Entity Edit") 
{
    set_update(true);
}

void EntityEditWidget::define() {
    set_show(editorRef->getState() == Editor::EditState::ENTITY);
    draw_text("TEST");
}