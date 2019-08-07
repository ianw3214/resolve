#include "newEntityWidget.hpp"
#include "../../editor.hpp"

const std::string NewEntityWidget::widgetName = "New Entity";

NewEntityWidget::NewEntityWidget(Editor * editor) 
    : editorRef(editor)
    , archetypeManager(editor->get_archetype_manager())
    , was_shown(false)
    , Widget(NewEntityWidget::widgetName, Anchor::TOP_RIGHT)
{
    set_update(true);
    set_show(false);
}

NewEntityWidget::~NewEntityWidget() {

}

void NewEntityWidget::define() {
    // Only bother updating if the widget is shown
    if (is_shown()) {
        // This is the switch to being shown
        if (!was_shown) {
            was_shown = true;
            editorRef->startTextInput();
        }
        // Print the current new entity name
        draw_text(std::string("NAME: ") + editorRef->getTextInput(), Widget::TextSize::SMALL);
        // List all archetypes
        auto archetypes = archetypeManager.get_archetypes();
        for (const std::string& archetype : archetypes) {
            draw_text(archetype, [=]() {
                editorRef->add_new_entity(editorRef->getTextInput(), archetype);
                editorRef->resetTextInput();
                editorRef->stopTextInput();
                set_show(false);
            });
        }
    } else {
        was_shown = false;
    }
}