#include "widget.hpp"

#include "core/engine.hpp"

void Widget::calculate_dim() {
    if (!m_show) {
        m_width = 0;
        m_height = 0;
        return;
    }
    // Calculate the dimensions by looking for the highest offset
    int max_width = 0;
    int max_height = 0;
    for (const Component * const comp : render_parts) {
        int w = comp->x_offset;
        int h = comp->y_offset;
        switch(comp->type) {
            // TODO: No hard coded size for text
            case ComponentType::TEXT: {
                // TODO: Calculate width somehow
                const TextComponent * const tex = dynamic_cast<const TextComponent* const>(comp);
                w += tex->text.size() * get_text_width(tex->size);
                h += static_cast<int>(tex->size);
            } break;
            case ComponentType::TEXT_REFERENCE: {
                // TODO: Calculate width somehow
                const TextReferenceComponent * const tex = dynamic_cast<const TextReferenceComponent* const>(comp);
                w += tex->reference->size() * get_text_width(tex->size);
                h += static_cast<int>(tex->size);
            } break;
            case ComponentType::IMAGE: {
                const ImageComponent * const img = dynamic_cast<const ImageComponent* const>(comp);
                w += img->w;
                h += img->h;
            } break;
        }
        if (w > max_width) max_width = w;
        if (h > max_height) max_height = h;
    }
    m_width = max_width;
    m_height = max_height;
}

Widget::Widget(const std::string& name, Anchor anchor) 
    : name(name)
    , anchor(anchor)
    , draw_x(0)
    , draw_y(0) 
    , m_update(false)
    , m_show(true)
{}

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

void Widget::new_line(TextSize size) {
    draw_x = 0;
    draw_y += static_cast<int>(size) + text_padding;
}


// TODO: Custom colours
// TODO: Handle new line
void Widget::draw_text(const std::string& text, TextSize size, bool newline) {
    render_parts.push_back(new TextComponent(text, newline, draw_x, draw_y, size));
    if (newline) new_line(size);
    else add_h_padding(text.size() * get_text_width(size) + text_padding);
}

// TODO: Custom colours
// TODO: Handle new line
void Widget::draw_text(const std::string& text, std::function<void()> f, TextSize size, bool newline) {
    render_parts.push_back(new TextComponent(text, newline, draw_x, draw_y, size));
    // TODO: Depend on size
    click_parts.push_back({{draw_x, draw_y, static_cast<int>(text.size()) * 20, 32}, f});
    if (newline) new_line(size);
    else add_h_padding(text.size() * get_text_width(size) + text_padding);
}

void Widget::draw_text_ref(std::string * ref, TextSize size, bool newline) {
    render_parts.push_back(new TextReferenceComponent(ref, newline, draw_x, draw_y, size));
    if (newline) new_line(size);
    else add_h_padding((*ref).size() * get_text_width(size) + text_padding);
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

bool Widget::is_mouse_over(int mouse_x, int mouse_y) const {
    /*
    // See if anything that should have been clicked on was clicked
    for (const ClickData& data : click_parts) {
        int x = this->x + data.area.x;
        int y = this->y + data.area.y;
        if (mouse_x > x && mouse_x < x + data.area.w 
            && mouse_y > y && mouse_y < y + data.area.h) 
        {
            return true;
        }
    }
    */
    if (mouse_x > x && mouse_x < x + m_width
        && mouse_y > y && mouse_y < y + m_height) 
    {
        return true;
    }
    return false;
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
            return true;
        }
    }
    return false;
}

void Widget::update() {
    if (m_update) {
        for (Component * comp : render_parts) delete comp;
        render_parts.clear();
        click_parts.clear();
        draw_x = 0;
        draw_y = 0;
        define();
        calculate_dim();
    }
}

void Widget::render() {
    if (!m_show) return;
    // Render a background first
    static Texture background("resources/black.png");
    background.render(x, y, m_width, m_height);
    for (const Component* component : render_parts) {
        if (component->type == ComponentType::TEXT) {
            TextComponent text = *(dynamic_cast<const TextComponent*>(component));
            // TODO: Cache this maybe
            // TODO: No magic numbers
            std::string font;
            if (text.size == TextSize::SMALL) font = "widget_small";
            if (text.size == TextSize::MEDIUM) font = "widget_medium";
            if (text.size == TextSize::LARGE) font = "widget_large";
            Texture tex(QcE::get_instance()->getTextEngine()->getTexture(text.text, font, {255, 255, 255, 255}));
            tex.render(x + text.x_offset, y + text.y_offset - 4); // NOT SURE WHY THIS IS NEEDED
            if (text.newline) new_line();
            else add_h_padding(text.text.size() * 10 + 6);   // TODO: CHANGE MAGIC NUMBERS
        }
        if (component->type == ComponentType::TEXT_REFERENCE) {
            TextReferenceComponent text = *(dynamic_cast<const TextReferenceComponent*>(component));
            // TODO: Cache this maybe
            // TODO: No magic numbers
            std::string font;
            if (text.size == TextSize::SMALL) font = "widget_small";
            if (text.size == TextSize::MEDIUM) font = "widget_medium";
            if (text.size == TextSize::LARGE) font = "widget_large";
            Texture tex(QcE::get_instance()->getTextEngine()->getTexture(*(text.reference), font, {255, 255, 255, 255}));
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