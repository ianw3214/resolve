#include "widget.hpp"

#include "core/engine.hpp"

Widget::Widget(const std::string& name, int x, int y) : name(name), x(x), y(y), draw_x(x), draw_y(y) {}
Widget::~Widget() {
    for (Component * component : render_parts) {
        delete component;
    }
    render_parts.clear();
}

void Widget::add_h_padding(int padding) {
    draw_x += padding;
}

void Widget::add_v_padding(int padding) {
    draw_y += padding;
}

void Widget::new_line() {
    draw_x = x;
    // TODO: No magic numbers
    draw_y += 16;
}


// TODO: Custom colours
// TODO: Custom text size
// TODO: Handle new line
void Widget::draw_text(const std::string& text, bool newline) {
    render_parts.push_back(new TextComponent(text, newline, draw_x, draw_y));
    if (newline) new_line();
    else add_h_padding(text.size() * 10 + 6);   // TODO: CHANGE MAGIC NUMBERS
}

// TODO: Custom colours
// TODO: Custom text size
// TODO: Handle new line
void Widget::draw_text(const std::string& text, std::function<void()> f, bool newline) {
    render_parts.push_back(new TextComponent(text, newline, draw_x, draw_y));
    // TODO: Depend on size
    click_parts.push_back({{draw_x, draw_y, static_cast<int>(text.size()) * 20, 32}, f});
    if (newline) new_line();
    else add_h_padding(text.size() * 10 + 6);   // TODO: CHANGE MAGIC NUMBERS
}

void Widget::draw_text_ref(std::string * ref, bool newline) {
    render_parts.push_back(new TextReferenceComponent(ref, newline, draw_x, draw_y));
    if (newline) new_line();
    else add_h_padding((*ref).size() * 10 + 6);   // TODO: CHANGE MAGIC NUMBERS
}

void Widget::draw_image(const std::string& tex, int w, int h) {
    render_parts.push_back(new ImageComponent(tex, w, h, draw_x, draw_y));
    add_h_padding(w);
}

void Widget::draw_image(const std::string& tex, int w, int h, std::function<void()> f) {
    render_parts.push_back(new ImageComponent(tex, w, h, draw_x, draw_y));
    click_parts.push_back({{draw_x, draw_y, w, h}, f});
    add_h_padding(w);
}

void Widget::draw_image(const std::string& tex, int w, int h, const Rect& src) {
    render_parts.push_back(new ImageComponent(tex, w, h, src, draw_x, draw_y));
    add_h_padding(w);
}

void Widget::draw_image(const std::string& tex, int w, int h, const Rect& src, std::function<void()> f) {
    render_parts.push_back(new ImageComponent(tex, w, h, src, draw_x, draw_y));
    click_parts.push_back({{draw_x, draw_y, w, h}, f});
    add_h_padding(w);
}

bool Widget::click(int mouse_x, int mouse_y) {
    // See if anything that should have been clicked on was clicked
    for (const ClickData& data : click_parts) {
        int x = this->x + data.area.x;
        int y = this->y + data.area.y;
        if (mouse_x > x && mouse_x < x + data.area.w 
            && mouse_y > y && mouse_y < y + data.area.h) 
        {
            data.callback();
        }
    }
    return false;
}

void Widget::render() {
    for (const Component* component : render_parts) {
        if (component->type == ComponentType::TEXT) {
            TextComponent text = *(dynamic_cast<const TextComponent*>(component));
            // TODO: Cache this maybe
            // TODO: No magic numbers
            Texture tex(QcE::get_instance()->getTextEngine()->getTexture(text.text, "widget_medium", {255, 255, 255, 255}));
            tex.render(x + text.x_offset, y + text.y_offset - 4); // NOT SURE WHY THIS IS NEEDED
            if (text.newline) new_line();
            else add_h_padding(text.text.size() * 10 + 6);   // TODO: CHANGE MAGIC NUMBERS
        }
        if (component->type == ComponentType::TEXT_REFERENCE) {
            TextReferenceComponent text = *(dynamic_cast<const TextReferenceComponent*>(component));
            // TODO: Cache this maybe
            // TODO: No magic numbers
            Texture tex(QcE::get_instance()->getTextEngine()->getTexture(*(text.reference), "widget_medium", {255, 255, 255, 255}));
            tex.render(x + text.x_offset, y + text.y_offset - 4); // NOT SURE WHY THIS IS NEEDED
            if (text.newline) new_line();
            else add_h_padding((*(text.reference)).size() * 10 + 6);   // TODO: CHANGE MAGIC NUMBERS
        }
        if (component->type == ComponentType::IMAGE) {
            ImageComponent img = *(dynamic_cast<const ImageComponent*>(component));
            Texture * tex = QcE::get_instance()->loadTexture(img.texture, img.texture);
            if (img.use_full_image) {
                tex->setSource(0, 0, tex->getWidth(), tex->getHeight());
                tex->render(x + img.x_offset, y + img.y_offset, img.w, img.h);
            } else {
                tex->setSource(img.source.x, img.source.y, img.source.w, img.source.h);
                tex->render(x + img.x_offset, y + img.y_offset, img.w, img.h);
            }
            add_h_padding(img.w);
        }
    }
}